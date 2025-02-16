use serde::{Deserialize, Serialize};
use std::fs;
use tauri::AppHandle;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Config {
    pub token: String,
    pub dareg_url: String,
}

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
