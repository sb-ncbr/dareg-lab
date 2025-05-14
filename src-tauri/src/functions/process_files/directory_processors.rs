use crate::types::upload_parameters::UploadParameters;
use onedata::api_calls::create_directory_at_path::create_directory_at_path;
use onedata::api_calls::remove_entry_at_path::remove_entry_at_path;
use std::path::PathBuf;

/// Handle the deletion of a directory
/// 
/// # Arguments
/// 
/// * `upload_parameters`: Upload parameters for the upload process.
/// * `upload_task_directory`: Directory to upload.
/// * `path`: Path of the directory to be deleted.
pub async fn handle_delete_directory(
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

/// Handle the creation of a directory
/// 
/// # Arguments
/// 
/// * `upload_parameters`: Upload parameters for the upload process.
/// * `upload_task_directory`: Directory to upload.
/// * `path`: Path of the directory to be created.
pub async fn handle_create_directory(
    upload_parameters: &UploadParameters,
    upload_task_directory: &str,
    path: PathBuf,
) {
    let relative_path = path.strip_prefix(upload_task_directory).unwrap();
    create_directory_at_path(
        relative_path,
        &upload_parameters.token,
        &upload_parameters.provider_url,
        &upload_parameters.one_data_directory_id,
    )
    .await
    .unwrap();
}
