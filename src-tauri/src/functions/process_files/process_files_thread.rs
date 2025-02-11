use std::collections::VecDeque;
use std::sync::Arc;
use std::time::Duration;
use onedata::api_calls::create_directory_at_path::create_directory_at_path;
use onedata::api_calls::create_file_at_path::create_file_at_path;
use onedata::api_calls::upload_file::upload_file_in_chunks;
use tauri::Window;
use tokio::sync::Mutex;
use tokio::time::sleep;
use crate::constants::CHUNK_SIZE;
use crate::types::app::{Status, Task};
use crate::types::upload_parameters::UploadParameters;

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
pub async fn process_files_thread(upload_parameters: UploadParameters, upload_task_arc: Arc<Mutex<VecDeque<Task>>>, upload_task_status_arc: Arc<Mutex<Status>>, upload_task_experiment_id_arc: Arc<Mutex<String>>, upload_task_window: Window, upload_task_directory: String) {
    println!("Uploading files");
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

        match task {
            Task::CreateFile(path) => {
                println!("Uploading file: {:?}", path);

                let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
                let file = create_file_at_path(
                    relative_path,
                    &upload_parameters.token,
                    &upload_parameters.provider_url,
                    &upload_parameters.one_data_directory_id
                ).await.unwrap();

                upload_file_in_chunks(
                    path.to_str().unwrap(),
                    &upload_parameters.token,
                    &upload_parameters.provider_url,
                    &file.file_id,
                    CHUNK_SIZE
                ).await.unwrap();
            }
            Task::ModifyFile => {
                todo!();
            }
            Task::MoveFile => {
                todo!();
            }
            Task::DeleteFile => {
                todo!();
            }
            Task::CreateDirectory(path) => {
                let relative_path = path.strip_prefix(upload_task_directory.as_str()).unwrap();
                create_directory_at_path(
                    relative_path,
                    &upload_parameters.token,
                    &upload_parameters.provider_url,
                    &upload_parameters.one_data_directory_id
                ).await.unwrap();
            }
            Task::MoveDirectory => {
                todo!();
            }
            Task::DeleteDirectory => {
                todo!();
            }
        }
    }

    let mut upload_experiment_id_guard = upload_task_experiment_id_arc.lock().await;
    upload_task_window.emit("files-upload-confirmation", upload_experiment_id_guard.clone()).unwrap();
    println!("Stopped uploading files");
}