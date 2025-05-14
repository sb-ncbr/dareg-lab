use crate::types::app::Task;
use crate::utils::files::scan_directory::{Entry, FileEntry};
use std::collections::VecDeque;
use std::path::PathBuf;
use tokio::sync::MutexGuard;

/// Handles the modification of a file entry.
/// 
/// # Arguments
/// 
/// * `entries`: A mutable slice of `Entry` objects representing the current state of files.
/// * `guard`: A mutable reference to a `MutexGuard` containing a queue of tasks.
/// * `file`: A reference to the `FileEntry` that has been modified.
pub fn handle_file_modified(
    entries: &mut [Entry],
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

/// Handles the creation of a file entry.
/// 
/// # Arguments
/// 
/// * `entries`: A mutable slice of `Entry` objects representing the current state of files.
/// * `guard`: A mutable reference to a `MutexGuard` containing a queue of tasks.
/// * `file`: A reference to the `FileEntry` that has been created.
pub fn handle_file_created(
    entries: &mut Vec<Entry>,
    guard: &mut MutexGuard<VecDeque<Task>>,
    file: &FileEntry,
) {
    guard.push_back(Task::CreateFile(file.path.clone()));
    entries.push(Entry::File(file.clone()));
}

/// Handles the deletion of files.
/// 
/// # Arguments
/// 
/// * `entries`: A mutable slice of `Entry` objects representing the current state of files.
/// * `current_entries`: A mutable reference to a `VecDeque` of `Entry` objects representing the current state.
/// * `guard`: A mutable reference to a `MutexGuard` containing a queue of tasks.
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::collections::VecDeque;
    use std::path::PathBuf;
    use tokio::sync::Mutex;

    fn create_file_entry(path: &str, hash: &str, size: u64) -> FileEntry {
        FileEntry {
            path: PathBuf::from(path),
            hash: hash.to_string(),
            size,
        }
    }

    fn extract_task_paths(tasks: &VecDeque<Task>) -> Vec<(String, PathBuf)> {
        tasks
            .iter()
            .map(|t| match t {
                Task::CreateFile(p) => ("CreateFile".to_string(), p.clone()),
                Task::ModifyFile(p) => ("ModifyFile".to_string(), p.clone()),
                Task::DeleteFile(p) => ("DeleteFile".to_string(), p.clone()),
                Task::CreateDirectory(p) => ("CreateDirectory".to_string(), p.clone()),
                Task::DeleteDirectory(p) => ("DeleteDirectory".to_string(), p.clone()),
            })
            .collect()
    }

    #[tokio::test]
    async fn test_handle_file_created_adds_task_and_entry() {
        let file = create_file_entry("new.txt", "abc123", 1024);
        let mut entries = vec![];
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_file_created(&mut entries, &mut guard, &file);

            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("CreateFile".to_string(), PathBuf::from("new.txt"))]
            );
        }

        assert_eq!(entries.len(), 1);
        match &entries[0] {
            Entry::File(f) => {
                assert_eq!(f.path, PathBuf::from("new.txt"));
                assert_eq!(f.hash, "abc123");
                assert_eq!(f.size, 1024);
            }
            _ => panic!("Expected File entry"),
        }
    }

    #[tokio::test]
    async fn test_handle_file_modified_updates_entry_and_adds_task() {
        let original = create_file_entry("file.txt", "oldhash", 100);
        let updated = create_file_entry("file.txt", "newhash", 200);
        let mut entries = vec![Entry::File(original)];
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_file_modified(&mut entries, &mut guard, &updated);

            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("ModifyFile".to_string(), PathBuf::from("file.txt"))]
            );
        }

        match &entries[0] {
            Entry::File(f) => {
                assert_eq!(f.hash, "newhash");
                assert_eq!(f.size, 200);
            }
            _ => panic!("Expected File entry"),
        }
    }

    #[tokio::test]
    async fn test_handle_files_deleted_removes_missing_and_adds_task() {
        let keep = create_file_entry("keep.txt", "h1", 1);
        let delete = create_file_entry("delete.txt", "h2", 2);
        let mut entries = vec![
            Entry::File(keep.clone()),
            Entry::File(delete.clone()),
        ];
        let mut current_entries = VecDeque::from(vec![Entry::File(keep.clone())]);
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_files_deleted(&mut entries, &mut current_entries, &mut guard);

            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("DeleteFile".to_string(), PathBuf::from("delete.txt"))]
            );
        }

        assert_eq!(entries.len(), 1);
        match &entries[0] {
            Entry::File(f) => assert_eq!(f.path, PathBuf::from("keep.txt")),
            _ => panic!("Expected File entry"),
        }
    }

    #[tokio::test]
    async fn test_handle_files_deleted_no_files_deleted() {
        let file1 = create_file_entry("a.txt", "hash", 1);
        let file2 = create_file_entry("b.txt", "hash", 2);
        let mut entries = vec![
            Entry::File(file1.clone()),
            Entry::File(file2.clone()),
        ];
        let mut current_entries = VecDeque::from(vec![
            Entry::File(file1.clone()),
            Entry::File(file2.clone()),
        ]);
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_files_deleted(&mut entries, &mut current_entries, &mut guard);
            assert!(guard.is_empty());
        }

        assert_eq!(entries.len(), 2);
    }

    #[tokio::test]
    async fn test_handle_files_deleted_all_deleted_when_current_empty() {
        let file = create_file_entry("gone.txt", "hash", 123);
        let mut entries = vec![Entry::File(file.clone())];
        let mut current_entries = VecDeque::new();
        let task_queue = Mutex::new(VecDeque::new());

        {
            let mut guard = task_queue.lock().await;
            handle_files_deleted(&mut entries, &mut current_entries, &mut guard);

            let tasks = extract_task_paths(&guard);
            assert_eq!(
                tasks,
                vec![("DeleteFile".to_string(), PathBuf::from("gone.txt"))]
            );
        }

        assert!(entries.is_empty());
    }
}
