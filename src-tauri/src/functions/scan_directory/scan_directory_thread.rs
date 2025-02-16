use crate::types::app::Task;
use crate::utils::files::scan_directory::{scan_directory, DirectoryEntry, Entry, FileEntry};
use serde::Serialize;
use std::collections::VecDeque;
use std::path::{Path, PathBuf};
use std::sync::Arc;
use std::time::Duration;
use tauri::Window;
use tokio::sync::{Mutex, MutexGuard};
use tokio::time;

#[derive(Debug, PartialEq)]
enum FileChange {
    Created,
    Modified,
    Moved,
    Unchanged,
    // Deleted, needs to be handled separately
}

#[derive(Debug, PartialEq)]
enum DirectoryChange {
    Created,
    Modified,
    Moved,
    Unchanged,
    // Deleted, needs to be handled separately
}

pub fn get_file_change(file: &FileEntry, entries: &Vec<Entry>) -> FileChange {
    let file_entries = entries
        .iter()
        .filter_map(|entry| match entry {
            Entry::File(file) => Some(file),
            _ => None,
        })
        .collect::<Vec<&FileEntry>>();

    if file_entries
        .iter()
        .any(|entry| entry.hash != file.hash && entry.path == file.path)
    {
        return FileChange::Modified;
    }

    if !file_entries
        .iter()
        .any(|entry| entry.hash == file.hash && entry.path == file.path)
    {
        return FileChange::Created;
    }
/*    if file_entries
        .iter()
        .any(|entry| entry.hash == file.hash && entry.path != file.path)
    {
        // TODO: Handle duplicate files
        return FileChange::Moved;
    }*/

    FileChange::Unchanged
}

pub fn get_directory_change(directory: &DirectoryEntry, entries: &Vec<Entry>) -> DirectoryChange {
    let directory_entries = entries
        .iter()
        .filter_map(|entry| match entry {
            Entry::Directory(directory) => Some(directory),
            _ => None,
        })
        .collect::<Vec<&DirectoryEntry>>();

    if !directory_entries
        .iter()
        .any(|entry| entry.path == directory.path)
    {
        return DirectoryChange::Created;
    }

    DirectoryChange::Unchanged
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
pub async fn scan_directory_thread(
    scan_task_arc: Arc<Mutex<VecDeque<Task>>>,
    scan_task_directory: String,
    scan_task_window: Window,
) {
    let mut interval = time::interval(Duration::from_secs(5));
    let mut entries: Vec<Entry> = Vec::new();
    loop {
        interval.tick().await;
        let mut current_entries = scan_directory(Path::new(scan_task_directory.as_str()), false).await;
        let mut guard = scan_task_arc.lock().await;

        for entry in &current_entries {
            match entry {
                Entry::File(file) => {
                    match get_file_change(&file, &entries) {
                        FileChange::Created => {
                            handle_file_created(&mut entries, &mut guard, file);
                        }
                        FileChange::Modified => {
                            handle_file_modified(&mut entries, &mut guard, file);
                        }
                        FileChange::Moved => {
                            handle_file_moved(&mut entries, &mut guard, file);
                        }
                        FileChange::Unchanged => {
                            // Do nothing
                        }
                    }
                }
                Entry::Directory(directory) => {
                    match get_directory_change(&directory, &entries) {
                        DirectoryChange::Created => {
                            handle_directory_created(&mut entries, &mut guard, directory);
                        }
                        DirectoryChange::Modified => {}
                        DirectoryChange::Moved => {}
                        DirectoryChange::Unchanged => {
                            // Do nothing
                        }
                    }
                }
            }
        }

        handle_files_deleted(&mut entries, &mut current_entries, &mut guard);
        // TODO: Handle deleted directories

        scan_task_window
            .emit("files-scanned", entries.clone())
            .unwrap();
    }
}

fn handle_file_moved(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    file: &FileEntry,
) {
    guard.push_back(Task::MoveFile(file.path.clone()));
    if let Some(num) = entries.iter_mut().find_map(|e| match e {
        Entry::File(f) => {
            if f.hash == file.hash {
                Some(f)
            } else {
                None
            }
        }
        _ => None,
    }) {
        num.path = file.path.clone();
    }
}

fn handle_file_modified(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    file: &FileEntry,
) {
    guard.push_back(Task::ModifyFile(file.path.clone()));
    if let Some(num) = entries.iter_mut().find_map(|e| match e {
        Entry::File(f) => {
            if f.path == file.path {
                Some(f)
            } else {
                None
            }
        }
        _ => None,
    }) {
        num.size = file.size;
        num.hash = file.hash.clone();
    }
}

fn handle_file_created(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    file: &FileEntry,
) {
    guard.push_back(Task::CreateFile(file.path.clone()));
    entries.push(Entry::File(file.clone()));
}

fn handle_files_deleted(
    entries: &mut Vec<Entry>,
    current_entries: &mut VecDeque<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
) {
    let current_paths = current_entries
        .iter()
        .filter_map(|entry| match entry {
            Entry::File(file) => Some(file.path.clone()),
            _ => None,
        })
        .collect::<Vec<PathBuf>>();
    for e in entries.iter().filter_map(|entry| match entry {
        Entry::File(file) => {
            if !current_paths.contains(&file.path) {
                Some(file)
            } else {
                None
            }
        }
        _ => None,
    }) {
        guard.push_back(Task::DeleteFile(e.path.clone()));
    }
    entries.retain(|entry| match entry {
        Entry::File(file) => current_paths.contains(&file.path),
        _ => true,
    });
}

fn handle_directory_created(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    directory: &DirectoryEntry,
) {
    guard.push_back(Task::CreateDirectory(directory.path.clone()));
    entries.push(Entry::Directory(directory.clone()));
}

fn handle_directories_deleted(
    entries: &mut Vec<Entry>,
    current_entries: &mut VecDeque<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
) {
    let current_directory_paths = current_entries
        .iter()
        .filter_map(|entry| match entry {
            Entry::Directory(directory) => Some(directory.path.clone()),
            _ => None,
        })
        .collect::<Vec<PathBuf>>();

    for e in entries.iter().filter_map(|entry| match entry {
        Entry::Directory(file) => {
            if !current_directory_paths.contains(&file.path) {
                Some(file)
            } else {
                None
            }
        }
        _ => None,
    }) {
        guard.push_back(Task::DeleteDirectory(e.path.clone()));
    }
    entries.retain(|entry| match entry {
        Entry::Directory(directory) => current_directory_paths.contains(&directory.path),
        _ => true,
    });
}
