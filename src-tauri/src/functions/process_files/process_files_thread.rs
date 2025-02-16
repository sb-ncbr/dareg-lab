use crate::constants::CHUNK_SIZE;
use crate::types::app::{Status, Task};
use crate::types::upload_parameters::UploadParameters;
use onedata::api_calls::create_directory_at_path::create_directory_at_path;
use onedata::api_calls::create_file_at_path::create_file_at_path;
use onedata::api_calls::upload_file::upload_file_in_chunks;
use std::collections::{HashMap, VecDeque};
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::Duration;
use onedata::api_calls::remove_entry_at_path::remove_entry_at_path;
use serde::Serialize;
use tauri::Window;
use tokio::sync::Mutex;
use tokio::time::sleep;

#[derive(Serialize, Clone)]
pub enum FileEventStatus {
    Started,
    Finished,
    Progress,
    Error,
}
#[derive(Serialize, Clone)]
pub struct FileEvent {
    pub path: PathBuf,
    pub status: FileEventStatus,
    pub progress: f32
}


/// Process the upload tasks
///
/// # Arguments
///
/// * `upload_parameters`:
/// * `upload_task_arc`:
/// * `upload_task_status_arc`:
/// * `upload_task_window`:
/// * `upload_task_directory`:
///
/// returns: ()
///
/// # Examples
///
/// ```
///
/// ```
pub async fn process_files_thread(
    upload_parameters: UploadParameters,
    upload_task_arc: Arc<Mutex<VecDeque<Task>>>,
    upload_task_status_arc: Arc<Mutex<Status>>,
    upload_task_experiment_id_arc: Arc<Mutex<String>>,
    upload_task_window: Window,
    upload_task_directory: String,
) {
    println!("Uploading files");

    let mut file_id_map: HashMap<PathBuf, String> = HashMap::new();

    loop {
        // Acquire the lock for the tasks
        let mut tasks_guard = upload_task_arc.lock().await;
        let mut upload_status_guard = upload_task_status_arc.lock().await;

        if tasks_guard.is_empty() && *upload_status_guard == Status::Syncing {
            *upload_status_guard = Status::Idle;
            break;
        }

        // If the tasks are empty, wait for a second, not to hold the lock
        if tasks_guard.is_empty() {
            drop(tasks_guard);
            drop(upload_status_guard);
            sleep(Duration::from_secs(1)).await;
            continue;
        }

        // Pop the task from the queue
        let task = tasks_guard.pop_front().unwrap();
        // Release the lock
        drop(tasks_guard);
        drop(upload_status_guard);

        println!("Processing task: \n{:?}", task);

        match task {
            Task::CreateFile(path) => {
                handle_create_file(&upload_parameters, &upload_task_window, &upload_task_directory, &mut file_id_map, path).await;
            }
            Task::ModifyFile(path) => {
                handle_modify_file(&upload_parameters, &upload_task_window, &upload_task_directory, &mut file_id_map, &path).await;
            }
            Task::MoveFile(path) => {
            /*    todo!();*/
            }
            Task::DeleteFile(path) => {
                handle_delete_file(&upload_parameters, &upload_task_directory, path).await;
            }
            Task::CreateDirectory(path) => {
                handle_create_directory(&upload_parameters, &upload_task_directory, path).await;
            }
            Task::MoveDirectory(path) => {
                /*    todo!();*/
            }
            Task::DeleteDirectory(path) => {
                handle_delete_directory(&upload_parameters, &upload_task_directory, path).await;
            }
        }
    }

    let mut upload_experiment_id_guard = upload_task_experiment_id_arc.lock().await;
    upload_task_window
        .emit(
            "files-upload-confirmation",
            upload_experiment_id_guard.clone(),
        )
        .unwrap();
    println!("Stopped uploading files");
}

async fn handle_delete_directory(upload_parameters: &UploadParameters, upload_task_directory: &String, path: PathBuf) {
    let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
    remove_entry_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
        .await
        .unwrap();
}

async fn handle_create_directory(upload_parameters: &UploadParameters, upload_task_directory: &String, path: PathBuf) {
    let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
    create_directory_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
        .await
        .unwrap();
}

async fn handle_delete_file(upload_parameters: &UploadParameters, upload_task_directory: &String, path: PathBuf) {
    let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
    remove_entry_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
        .await
        .unwrap();
}

async fn handle_modify_file(upload_parameters: &UploadParameters, upload_task_window: &Window, upload_task_directory: &String, file_id_map: &mut HashMap<PathBuf, String>, path: &PathBuf) {
    let file_id = file_id_map.get(path).unwrap();
    upload_task_window
        .emit(
            "file-event",
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Started,
                progress: 0.0
            }
        ).unwrap();

    let window_clone = upload_task_window.clone();
    let path_clone = path.clone();

    upload_file_in_chunks(
        path.to_str().unwrap(),
        &upload_parameters.token,
        &upload_parameters.provider_url,
        file_id,
        CHUNK_SIZE,
        Box::new(move |uploaded: u64, total: u64| {
            // TODO:  if uploaded is equal to total, do not emmit
            window_clone
                .emit(
                    "file-event",
                    FileEvent {
                        path: path_clone.clone(),
                        status: FileEventStatus::Progress,
                        progress: uploaded as f32 / total as f32
                    },
                )
                .unwrap();
        }),
    )
        .await
        .unwrap();

    upload_task_window
        .emit(
            "file-event",
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Finished,
                progress: 1.0
            }
        ).unwrap();
}

async fn handle_create_file(upload_parameters: &UploadParameters, upload_task_window: &Window, upload_task_directory: &String, file_id_map: &mut HashMap<PathBuf, String>, path: PathBuf) {
    let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
    upload_task_window
        .emit(
            "file-event",
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Started,
                progress: 0.0
            }
        ).unwrap();
    let file = create_file_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
        .await
        .unwrap();

    let window_clone = upload_task_window.clone();
    let path_clone = path.clone();
    upload_file_in_chunks(
        path.to_str().unwrap(),
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &file.file_id,
        CHUNK_SIZE,
        Box::new(move |uploaded: u64, total: u64| {
            window_clone
                .emit(
                    "file-event",
                    FileEvent {
                        path: path_clone.clone(),
                        status: FileEventStatus::Progress,
                        progress: uploaded as f32 / total as f32
                    },
                )
                .unwrap();
        }),
    )
        .await
        .unwrap();

    file_id_map.insert(path.clone(), file.file_id);

    upload_task_window
        .emit(
            "file-event",
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Finished,
                progress: 1.0
            }
        ).unwrap();
}
