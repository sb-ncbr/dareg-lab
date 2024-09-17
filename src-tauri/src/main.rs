// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::VecDeque;
use tauri::{Manager, Window};

#[derive(Clone, serde::Serialize)]
enum Status {
    Error,
    Success,
    Syncing,
    Prepared,
}

#[derive(Clone, serde::Serialize)]
struct File {
    file: String,
    size: f64,
    synchronized: f64,
    status: Status,
}

// the payload type must implement `Serialize` and `Clone`.
#[derive(Clone, serde::Serialize)]
struct FilesStatus {
    files: Vec<File>,
}

// init a background process on the command, and emit periodic events only to the window that used the command
#[tauri::command]
fn start_measurement(window: Window) {
    let delay = std::time::Duration::from_millis(200);

    std::thread::spawn(move || {
        let mut file_index = 0;
        let mut files = vec![
            File {
                file: "file1".to_string(),
                size: 67676767767.0,
                synchronized: 0.0,
                status: Status::Syncing,
            },
            File {
                file: "file2".to_string(),
                size: 67767667676.0,
                synchronized: 0.0,
                status: Status::Prepared,
            },
            File {
                file: "file3".to_string(),
                size: 565656565656565.0,
                synchronized: 0.0,
                status: Status::Prepared,
            },
        ];

        loop {
            files[file_index].synchronized += files[file_index].size / (10.0 * (1.0 / delay.as_secs_f64()));
            files[file_index].status = Status::Syncing;

            if files[file_index].synchronized >= files[file_index].size {
                files[file_index].synchronized = files[file_index].size;
                files[file_index].status = Status::Success;
                file_index += 1;
            }

            window.emit("event-name", FilesStatus {files: files.clone()}).unwrap();
            if file_index == files.len() {
                break;
            }

            std::thread::sleep(delay);
        }
    });
}

fn setup_handler(app: &mut tauri::App) -> Result<(), Box<dyn std::error::Error + 'static>> {
       let app_handle = app.handle();

        println!("{}", app_handle.path_resolver().resource_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", app_handle.path_resolver().app_config_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", app_handle.path_resolver().app_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", app_handle.path_resolver().app_local_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", app_handle.path_resolver().app_cache_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", app_handle.path_resolver().app_log_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::local_data_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::cache_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::config_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::executable_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::public_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::runtime_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::template_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::font_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::home_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::audio_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::desktop_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::document_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::download_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        println!("{}", tauri::api::path::picture_dir().unwrap_or(std::path::PathBuf::new()).to_string_lossy());
        Ok(())
}

fn main() {
    tauri::Builder::default()
        .setup(setup_handler)
        .invoke_handler(tauri::generate_handler![start_measurement])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
