use log::info;
use crate::types::app::AppData;
use crate::utils::config::Config;
use tauri::{Manager, Window};

/// Command to get the config from the window state
///
/// # Arguments
///
/// * `window`:
///
/// returns: Config
///
/// # Examples
///
/// ```
///
/// ```
#[tauri::command]
pub fn get_config(window: Window) -> Config {
    info!("[get_config.start] Getting the config");
    window.state::<AppData>().config.clone()
}
