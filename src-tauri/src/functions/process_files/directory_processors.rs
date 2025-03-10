use std::path::PathBuf;
use onedata::api_calls::create_directory_at_path::create_directory_at_path;
use onedata::api_calls::remove_entry_at_path::remove_entry_at_path;
use crate::types::upload_parameters::UploadParameters;

pub async fn handle_delete_directory(upload_parameters: &UploadParameters, upload_task_directory: &String, path: PathBuf) {
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

pub async fn handle_create_directory(upload_parameters: &UploadParameters, upload_task_directory: &String, path: PathBuf) {
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