use crate::types::app::{AppData, Config};
use log::info;
use tauri::{Manager, Window};

/// Command to get the config from the window state
///
/// # Arguments
///
/// * `window`: Tauri Application Window
///
/// returns: Config
#[tauri::command]
pub fn get_config(window: Window) -> Config {
    info!("[get_config.start] Getting the config");
    window.state::<AppData>().config.clone()
}
