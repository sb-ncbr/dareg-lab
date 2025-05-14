use crate::utils::files::scan_directory::{Entry, FileEntry};

#[derive(Debug, PartialEq)]
pub enum FileChange {
    Created,
    Modified,
    Unchanged,
}

/// Determines the change status of a file based on its hash and path.
/// 
/// # Arguments
/// 
/// * `file`: A reference to the `FileEntry` to check.
/// * `entries`: A slice of `Entry` objects representing the current state of files.
///
/// returns: FileChange
pub fn get_file_change(file: &FileEntry, entries: &[Entry]) -> FileChange {
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
    FileChange::Unchanged
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn create_file_entry(hash: &str, path: &str, size: u64) -> FileEntry {
        FileEntry {
            hash: hash.to_string(),
            path: PathBuf::from(path),
            size,
        }
    }

    #[test]
    fn test_created_when_no_match_in_entries() {
        let file = create_file_entry("hash123", "new_file.txt", 123);
        let entries = vec![
            Entry::File(create_file_entry("abc", "a.txt", 111)),
            Entry::File(create_file_entry("def", "b.txt", 222)),
        ];
        assert_eq!(get_file_change(&file, &entries), FileChange::Created);
    }

    #[test]
    fn test_modified_when_path_matches_but_hash_differs() {
        let file = create_file_entry("new_hash", "shared.txt", 300);
        let entries = vec![
            Entry::File(create_file_entry("old_hash", "shared.txt", 300)), // same path, diff hash
            Entry::File(create_file_entry("xyz", "other.txt", 150)),
        ];
        assert_eq!(get_file_change(&file, &entries), FileChange::Modified);
    }

    #[test]
    fn test_unchanged_when_hash_and_path_match_among_others() {
        let file = create_file_entry("same_hash", "unchanged.txt", 200);
        let entries = vec![
            Entry::File(create_file_entry("other_hash", "other.txt", 111)),
            Entry::File(create_file_entry("same_hash", "unchanged.txt", 200)),
            Entry::File(create_file_entry("another_hash", "x.txt", 555)),
        ];
        assert_eq!(get_file_change(&file, &entries), FileChange::Unchanged);
    }

    #[test]
    fn test_created_even_with_matching_hash_but_different_path() {
        let file = create_file_entry("dup_hash", "new_path.txt", 500);
        let entries = vec![
            Entry::File(create_file_entry("dup_hash", "old_path.txt", 500)), // same hash, different path
        ];
        // This should be considered "Created" until Moved is implemented
        assert_eq!(get_file_change(&file, &entries), FileChange::Created);
    }

    #[test]
    fn test_modified_when_multiple_similar_paths_exist() {
        let file = create_file_entry("hash_v2", "common.txt", 444);
        let entries = vec![
            Entry::File(create_file_entry("hash_v1", "common.txt", 444)), // match path, different hash
            Entry::File(create_file_entry("hash_v1", "another.txt", 123)),
            Entry::File(create_file_entry("hash_v2", "common_v2.txt", 444)),
        ];
        assert_eq!(get_file_change(&file, &entries), FileChange::Modified);
    }

    #[test]
    fn test_created_with_empty_entries_list() {
        let file = create_file_entry("new_hash", "brand_new.txt", 321);
        let entries = vec![];
        assert_eq!(get_file_change(&file, &entries), FileChange::Created);
    }
}
