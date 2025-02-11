use tauri::{Manager, Window};
use crate::{State, Status};


#[tauri::command]
pub async fn stop_upload(window: Window) -> Result<(), ()> {
    println!("[stop_upload.start] Command Started");

    let window_clone = window.clone(); // Store the cloned window
    let state = window_clone.state::<State>(); // Now this reference is valid

    let mut scan_handle_guard = state.scan_handle.lock().await;

    // Stop scanning
    if let Some(handle) = scan_handle_guard.take() {
        handle.abort();
        println!("[stop_upload.scanning] Stopped scanning");
    } else {
        println!("[stop_upload.scanning] No scanning to stop");
    }

    // Set status to Syncing to finish the upload
    let mut status = state.status.lock().await;
    if *status != Status::Running {
        println!("[stop_upload.status] Cannot stop upload. Status is not Running");
        return Err(());
    }
    *status = Status::Syncing;

    println!("[stop_upload.finished] Command Finished");
    Ok(())
}