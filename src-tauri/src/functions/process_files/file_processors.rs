use crate::constants::CHUNK_SIZE;
use crate::functions::process_files::process_files_thread::{FileEvent, FileEventStatus};
use crate::types::upload_parameters::UploadParameters;
use onedata::api_calls::create_file_at_path::create_file_at_path;
use onedata::api_calls::remove_entry_at_path::remove_entry_at_path;
use onedata::api_calls::upload_file::upload_file_in_chunks;
use std::collections::HashMap;
use std::path::PathBuf;
use tauri::Window;

const FILE_EVENT_NAME: &str = "file-event";

pub async fn handle_modify_file(
    upload_parameters: &UploadParameters,
    upload_task_window: &Window,
    file_id_map: &mut HashMap<PathBuf, String>,
    path: &PathBuf,
) {
    let file_id = file_id_map.get(path).unwrap();
    upload_task_window
        .emit(
            FILE_EVENT_NAME,
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Started,
                progress: 0.0,
            },
        )
        .unwrap();

    upload_file_in_chunks(
        path.to_str().unwrap(),
        &upload_parameters.token,
        &upload_parameters.provider_url,
        file_id,
        CHUNK_SIZE,
        create_progress_emitter(upload_task_window.clone(), path.clone()),
    )
    .await
    .unwrap();

    upload_task_window
        .emit(
            FILE_EVENT_NAME,
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Finished,
                progress: 1.0,
            },
        )
        .unwrap();
}

pub async fn handle_create_file(
    upload_parameters: &UploadParameters,
    upload_task_window: &Window,
    upload_task_directory: &str,
    file_id_map: &mut HashMap<PathBuf, String>,
    path: PathBuf,
) {
    let relative_path = path.strip_prefix(upload_task_directory).unwrap();
    upload_task_window
        .emit(
            FILE_EVENT_NAME,
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Started,
                progress: 0.0,
            },
        )
        .unwrap();
    let file = create_file_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
    .await
    .unwrap();

    upload_file_in_chunks(
        path.to_str().unwrap(),
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &file.file_id,
        CHUNK_SIZE,
        create_progress_emitter(upload_task_window.clone(), path.clone()),
    )
    .await
    .unwrap();

    file_id_map.insert(path.clone(), file.file_id);

    upload_task_window
        .emit(
            FILE_EVENT_NAME,
            FileEvent {
                path: path.clone(),
                status: FileEventStatus::Finished,
                progress: 1.0,
            },
        )
        .unwrap();
}

pub async fn handle_delete_file(
    upload_parameters: &UploadParameters,
    upload_task_directory: &str,
    path: PathBuf,
) {
    let relative_path = path.strip_prefix(upload_task_directory).unwrap();
    remove_entry_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
    .await
    .unwrap();
}

fn create_progress_emitter(
    window: Window,
    path: PathBuf,
) -> Box<dyn Fn(u64, u64) + Send + 'static> {
    Box::new(move |uploaded: u64, total: u64| {
        if uploaded == total {
            return;
        }
        window
            .emit(
                FILE_EVENT_NAME,
                FileEvent {
                    path: path.clone(),
                    status: FileEventStatus::Progress,
                    progress: uploaded as f32 / total as f32,
                },
            )
            .unwrap();
    })
}
