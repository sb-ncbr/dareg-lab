use std::fs;
use tauri::AppHandle;
use crate::types::app::Config;

/// Loads the configuration from the config.json file in the app's config directory.
///
/// # Arguments
///
/// * `handle`: A reference to the AppHandle.
///
/// Returns: Result<Config, String>
pub fn load_config(handle: &AppHandle) -> Result<Config, String> {
    let path = match handle.path_resolver().app_config_dir() {
        Some(path) => path.join("config.json"),
        None => return Err("Failed to get the app config directory".to_string()),
    };

    // Read the file contents into a string
    let file_content = match fs::read_to_string(path) {
        Ok(content) => content,
        Err(e) => {
            return Err(e.to_string());
        }
    };

    // Parse the JSON string into the Config struct
    match serde_json::from_str(&file_content) {
        Ok(config) => Ok(config),
        Err(e) => Err(e.to_string()),
    }
}
