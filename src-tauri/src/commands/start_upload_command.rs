use crate::api_calls::get_upload_parameters::get_upload_parameters;
use crate::functions::process_files::process_files_thread::process_files_thread;
use crate::functions::scan_directory::scan_directory_thread::scan_directory_thread;
use crate::types::app::AppData;
use crate::{State, Status};
use log::{error, info};
use tauri::{Manager, Window};

#[tauri::command]
pub async fn start_upload(
    window: Window,
    directory: String,
    experiment_id: String,
) -> Result<(), ()> {
    info!(
        "[start_upload.start] Started uploading files from: {:?} for experiment id {:?}",
        directory, experiment_id
    );

    let experiment = experiment_id.as_str();

    let config = window.state::<AppData>().config.clone();
    let window_clone = window.clone(); // Store the cloned window
    let state = window_clone.state::<State>(); // Now this reference is valid

    let mut status = state.status.lock().await;
    let mut experiment_id_guard = state.experiment_id.lock().await;
    if *status != Status::Idle {
        error!("[start_upload.status] Already running");
        return Err(());
    }

    let upload_parameters =
        match get_upload_parameters(experiment, &config.dareg_url, &config.token).await {
            Ok(x) => x,
            Err(_) => {
                error!("[start_upload.upload_parameters] Unable to get upload parameters");
                return Err(());
            }
        };

    let scan_task = tokio::spawn(scan_directory_thread(
        state.tasks.clone(),
        directory.clone(),
        window.clone(),
    ));
    let mut scan_handle_guard = state.scan_handle.lock().await;
    *scan_handle_guard = Some(scan_task);

    let upload_task = tokio::spawn(process_files_thread(
        upload_parameters,
        state.tasks.clone(),
        state.status.clone(),
        state.experiment_id.clone(),
        window.clone(),
        directory.clone(),
    ));
    let mut upload_handle_guard = state.upload_handle.lock().await;
    *upload_handle_guard = Some(upload_task);

    *status = Status::Running;
    *experiment_id_guard = experiment_id;

    info!("[start_upload.finished] Command Finished");
    Ok(())
}
