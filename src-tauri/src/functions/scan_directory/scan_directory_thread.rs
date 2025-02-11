use std::collections::VecDeque;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::Duration;
use serde::Serialize;
use tauri::Window;
use tokio::sync::Mutex;
use tokio::time;
use crate::types::app::Task;
use crate::utils::files::scan_directory::{scan_directory, Entry};

#[derive(Debug, PartialEq)]
enum FileChange {
    Created,
    Modified,
    Moved,
    Unchanged,
}

#[derive(Serialize, Clone)]
struct FileEntry {
    hash: String,
    path: PathBuf,
    size: u64,
}

pub fn get_file_change(hash: &String, path: &PathBuf, entries: &Vec<FileEntry>) -> FileChange {
    if !entries.iter().any(|entry| &entry.hash == hash && &entry.path == path) {
        return FileChange::Created;
    }
    if entries.iter().any(|entry| &entry.hash == hash && &entry.path != path) { // TODO: Handle duplicate files
        return FileChange::Moved;
    }

    if entries.iter().any(|entry| &entry.hash != hash && &entry.path == path) {
        return FileChange::Modified;
    }

    FileChange::Unchanged
}


/// Scan given directory for files and directories and publish changes to synchronize
///
/// # Arguments
///
/// * `scan_task_arc`:
/// * `scan_task_directory`:
/// * `scan_task_window`:
///
/// returns: ()
///
/// # Examples
///
/// ```
///
/// ```
pub async fn scan_directory_thread(scan_task_arc: Arc<Mutex<VecDeque<Task>>>, scan_task_directory: String, scan_task_window: Window) {
    let mut pushed = false;
    let mut interval = time::interval(Duration::from_secs(5));
    let mut entries: Vec<FileEntry> = Vec::new();
    loop {
        interval.tick().await;
        let mut current_entries = scan_directory(Path::new(scan_task_directory.as_str()), false).await;

        while !pushed && !current_entries.is_empty() {
            let mut guard = scan_task_arc.lock().await;
            let entry = current_entries.pop_front().unwrap();

            match entry {
                Entry::File(path, hash, size) => {
                    match get_file_change(&hash, &path, &entries) {
                        FileChange::Created => {
                            guard.push_back(Task::CreateFile(path.clone()));
                            entries.push(FileEntry {
                                hash,
                                path,
                                size
                            });
                        }
                        FileChange::Modified => {}
                        FileChange::Moved => {}
                        FileChange::Unchanged => {}
                    }
                    // TODO: Handle deleted files
                }
                Entry::Directory(path) => {
                    guard.push_back(Task::CreateDirectory(path.clone()));
                    // TODO: Handle move directories
                    // TODO: Handle deleted directories
                }
            }
        }
        pushed = true;
        scan_task_window.emit("files-scanned", entries.clone()).unwrap();
    }
}