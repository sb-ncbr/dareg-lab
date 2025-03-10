use std::collections::VecDeque;
use std::path::PathBuf;
use tokio::sync::MutexGuard;
use crate::types::app::Task;
use crate::utils::files::scan_directory::{DirectoryEntry, Entry};

pub fn handle_directory_created(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    directory: &DirectoryEntry,
) {
    guard.push_back(Task::CreateDirectory(directory.path.clone()));
    entries.push(Entry::Directory(directory.clone()));
}

pub fn handle_directories_deleted(
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