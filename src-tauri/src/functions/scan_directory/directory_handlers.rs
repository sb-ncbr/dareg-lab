use crate::types::app::Task;
use crate::utils::files::scan_directory::{DirectoryEntry, Entry};
use std::collections::VecDeque;
use std::path::PathBuf;
use tokio::sync::MutexGuard;

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

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::VecDeque;
    use std::path::PathBuf;
    use tokio::sync::{Mutex};

    fn create_directory_entry(path: &str) -> DirectoryEntry {
        DirectoryEntry {
            path: PathBuf::from(path),
        }
    }

    fn extract_task_paths(tasks: &VecDeque<Task>) -> Vec<(String, PathBuf)> {
        tasks
            .iter()
            .map(|t| match t {
                Task::CreateDirectory(p) => ("CreateDirectory".into(), p.clone()),
                Task::DeleteDirectory(p) => ("DeleteDirectory".into(), p.clone()),
                Task::CreateFile(p) => ("CreateFile".into(), p.clone()),
                Task::ModifyFile(p) => ("ModifyFile".into(), p.clone()),
                Task::DeleteFile(p) => ("DeleteFile".into(), p.clone()),
            })
            .collect()
    }

    #[tokio::test]
    async fn test_handle_directory_created_adds_task_and_entry() {
        let dir = create_directory_entry("new_dir");
        let mut entries = vec![];
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_directory_created(&mut entries, &mut guard, &dir);
            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("CreateDirectory".to_string(), PathBuf::from("new_dir"))]
            );
        }

        assert_eq!(entries.len(), 1);
        assert!(matches!(entries[0], Entry::Directory(_)));
    }

    #[tokio::test]
    async fn test_handle_directories_deleted_removes_missing_and_adds_task() {
        let keep_dir = create_directory_entry("keep");
        let delete_dir = create_directory_entry("delete");

        let mut entries = vec![
            Entry::Directory(keep_dir.clone()),
            Entry::Directory(delete_dir.clone()),
        ];
        let mut current_entries = VecDeque::from(vec![Entry::Directory(keep_dir.clone())]);
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_directories_deleted(&mut entries, &mut current_entries, &mut guard);
            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("DeleteDirectory".to_string(), PathBuf::from("delete"))]
            );
        }

        assert_eq!(
            entries,
            vec![Entry::Directory(DirectoryEntry {
                path: PathBuf::from("keep")
            })]
        );
    }

    #[tokio::test]
    async fn test_handle_directories_deleted_does_nothing_if_all_present() {
        let dir1 = create_directory_entry("dir1");
        let dir2 = create_directory_entry("dir2");

        let mut entries = vec![
            Entry::Directory(dir1.clone()),
            Entry::Directory(dir2.clone()),
        ];
        let mut current_entries = VecDeque::from(vec![
            Entry::Directory(dir1.clone()),
            Entry::Directory(dir2.clone()),
        ]);
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_directories_deleted(&mut entries, &mut current_entries, &mut guard);
            assert!(guard.is_empty());
        }

        assert_eq!(entries.len(), 2);
    }

    #[tokio::test]
    async fn test_handle_directories_deleted_with_empty_current_entries() {
        let dir = create_directory_entry("old_dir");

        let mut entries = vec![Entry::Directory(dir.clone())];
        let mut current_entries = VecDeque::new();
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_directories_deleted(&mut entries, &mut current_entries, &mut guard);
            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("DeleteDirectory".to_string(), PathBuf::from("old_dir"))]
            );
        }

        assert!(entries.is_empty());
    }
}


