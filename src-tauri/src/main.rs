// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod api_calls;
mod commands;
mod constants;
mod functions;
mod types;
mod utils;

use crate::types::app::{State, Status};
use commands::get_config_command::get_config;
use commands::start_upload_command::start_upload;
use commands::stop_upload_command::stop_upload;
use std::collections::VecDeque;
use std::sync::Arc;
use tauri::Manager;
use tokio::sync::Mutex;
use types::app::AppData;
use utils::config::load_config;

fn setup_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error + 'static>> {
    let app_handle = app.handle();

    let config = load_config(&app_handle).unwrap();
    app.manage(AppData { config });
    app.manage(State {
        scan_handle: Mutex::new(None),
        upload_handle: Mutex::new(None),
        tasks: Arc::new(Mutex::new(VecDeque::new())),
        status: Arc::new(Mutex::new(Status::Idle)),
        experiment_id: Arc::new(Mutex::new(String::new())),
    });

    let window = app.get_webview_window("main").unwrap();
    window.open_devtools();

    // println!("{}", app_handle.path_resolver().resource_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", app_handle.path_resolver().app_config_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", app_handle.path_resolver().app_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", app_handle.path_resolver().app_local_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", app_handle.path_resolver().app_cache_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", app_handle.path_resolver().app_log_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::local_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::cache_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::config_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::executable_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::public_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::runtime_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::template_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::font_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::home_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::audio_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::desktop_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::document_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::download_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    // println!("{}", tauri::api::path::picture_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(setup_handler)
        .invoke_handler(tauri::generate_handler![
            start_upload,
            stop_upload,
            get_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
