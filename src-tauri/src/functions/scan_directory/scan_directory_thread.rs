use crate::functions::scan_directory::directory_change_resolver::{
    get_directory_change, DirectoryChange,
};
use crate::functions::scan_directory::directory_handlers::{
    handle_directories_deleted, handle_directory_created,
};
use crate::functions::scan_directory::file_change_resolver::{get_file_change, FileChange};
use crate::functions::scan_directory::file_handlers::{
    handle_file_created, handle_file_modified, handle_files_deleted,
};
use crate::types::app::Task;
use crate::utils::files::scan_directory::{scan_directory, Entry};
use std::collections::VecDeque;
use std::path::Path;
use std::sync::Arc;
use std::time::Duration;
use tauri::Window;
use tokio::sync::Mutex;
use tokio::time;
use crate::constants::FILES_SCANNED_EVENT_NAME;

/// Scan given directory for files and directories and publish changes to synchronize
///
/// # Arguments
///
/// * `scan_task_arc`:
/// * `scan_task_directory`:
/// * `scan_task_window`:
///
/// returns: ()
pub async fn scan_directory_thread(
    scan_task_arc: Arc<Mutex<VecDeque<Task>>>,
    scan_task_directory: String,
    scan_task_window: Window,
) {
    let mut interval = time::interval(Duration::from_secs(5));
    let mut entries: Vec<Entry> = Vec::new();
    loop {
        interval.tick().await;
        let mut current_entries = scan_directory(Path::new(scan_task_directory.as_str())).await;
        let mut guard = scan_task_arc.lock().await;

        for entry in &current_entries {
            match entry {
                Entry::File(file) => {
                    match get_file_change(file, &entries) {
                        FileChange::Created => {
                            handle_file_created(&mut entries, &mut guard, file);
                        }
                        FileChange::Modified => {
                            handle_file_modified(&mut entries, &mut guard, file);
                        }
                        FileChange::Unchanged => {
                            // Do nothing
                        }
                    }
                }
                Entry::Directory(directory) => {
                    match get_directory_change(directory, &entries) {
                        DirectoryChange::Created => {
                            handle_directory_created(&mut entries, &mut guard, directory);
                        }
                        DirectoryChange::Unchanged => {
                            // Do nothing
                        }
                    }
                }
            }
        }

        handle_files_deleted(&mut entries, &mut current_entries, &mut guard);
        handle_directories_deleted(&mut entries, &mut current_entries, &mut guard);

        scan_task_window
            .emit(FILES_SCANNED_EVENT_NAME, entries.clone())
            .unwrap();
    }
}
