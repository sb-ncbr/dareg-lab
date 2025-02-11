use tauri::{Manager, Window};
use crate::types::app::AppData;
use crate::utils::config::Config;


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
    window.state::<AppData>().config.clone()
}