use crate::functions::process_files::directory_processors::{
    handle_create_directory, handle_delete_directory,
};
use crate::functions::process_files::file_processors::{
    handle_create_file, handle_delete_file, handle_modify_file,
};
use crate::types::app::{Status, Task};
use crate::types::upload_parameters::UploadParameters;
use log::info;
use serde::Serialize;
use std::collections::{HashMap, VecDeque};
use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;
use std::time::Instant;
use tauri::Window;
use tokio::sync::Mutex;
use tokio::time::sleep;

const FILE_UPLOAD_CONFIRMATION_EVENT_NAME: &str = "files-upload-confirmation";

#[derive(Serialize, Clone)]
pub enum FileEventStatus {
    Started,
    Finished,
    Progress,
    // Error,
}
#[derive(Serialize, Clone)]
pub struct FileEvent {
    pub path: PathBuf,
    pub status: FileEventStatus,
    pub progress: f32,
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
    info!("[tasks_processing.start]: Started uploading files.");

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

        let before = Instant::now();
        info!("[task_processing.start]: \n{:?}", &task);
        match task {
            Task::CreateFile(path) => {
                handle_create_file(
                    &upload_parameters,
                    &upload_task_window,
                    &upload_task_directory,
                    &mut file_id_map,
                    path,
                )
                .await;
            }
            Task::ModifyFile(path) => {
                handle_modify_file(
                    &upload_parameters,
                    &upload_task_window,
                    &mut file_id_map,
                    &path,
                )
                .await;
            }
            Task::DeleteFile(path) => {
                handle_delete_file(&upload_parameters, &upload_task_directory, path).await;
            }
            Task::CreateDirectory(path) => {
                handle_create_directory(&upload_parameters, &upload_task_directory, path).await;
            }
            Task::DeleteDirectory(path) => {
                handle_delete_directory(&upload_parameters, &upload_task_directory, path).await;
            }
        }
        let elapsed = before.elapsed();
        info!("[task_processing.stop] elapsed: {}", elapsed.as_secs_f64());
    }

    let upload_experiment_id_guard = upload_task_experiment_id_arc.lock().await;
    upload_task_window
        .emit(
            FILE_UPLOAD_CONFIRMATION_EVENT_NAME,
            upload_experiment_id_guard.clone(),
        )
        .unwrap();
    info!("[tasks_processing.finished]: Finished uploading files.");
}
