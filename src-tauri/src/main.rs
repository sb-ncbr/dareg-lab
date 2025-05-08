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
use std::fs::OpenOptions;
use std::sync::Arc;
use log::LevelFilter;
use tauri::Manager;
use tokio::sync::Mutex;
use types::app::AppData;
use utils::config::load_config;

fn setup_logging() {
    if cfg!(debug_assertions) {
        env_logger::init();
    } else {
        // let log_file = OpenOptions::new()
        //     .create(true)
        //     .append(true)
        //     .open("app.log")
        //     .unwrap();
        //
        // fern::Dispatch::new()
        //     .level(LevelFilter::Info)
        //     .chain(log_file)
        //     .apply()
        //     .unwrap();
    }
}

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
    Ok(())
}

fn main() {
    setup_logging();
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
