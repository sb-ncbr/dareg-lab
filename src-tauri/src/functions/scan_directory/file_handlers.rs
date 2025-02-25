// fn handle_file_moved(
//     entries: &mut Vec<Entry>,
//     guard: &mut MutexGuard<VecDeque<Task>>,
//     file: &FileEntry,
// ) {
//     guard.push_back(Task::MoveFile(file.path.clone()));
//     if let Some(num) = entries.iter_mut().find_map(|e| match e {
//         Entry::File(f) => {
//             if f.hash == file.hash {
//                 Some(f)
//             } else {
//                 None
//             }
//         }
//         _ => None,
//     }) {
//         num.path = file.path.clone();
//     }
// }

use std::collections::VecDeque;
use std::path::PathBuf;
use tokio::sync::MutexGuard;
use crate::types::app::Task;
use crate::utils::files::scan_directory::{Entry, FileEntry};

pub fn handle_file_modified(
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

pub fn handle_file_created(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    file: &FileEntry,
) {
    guard.push_back(Task::CreateFile(file.path.clone()));
    entries.push(Entry::File(file.clone()));
}

pub fn handle_files_deleted(
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