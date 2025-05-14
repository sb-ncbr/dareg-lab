use crate::utils::files::scan_directory::{DirectoryEntry, Entry};

#[derive(Debug, PartialEq)]
pub enum DirectoryChange {
    Created,
    Unchanged,
}

/// Determines the change status of a directory based on its path.
/// 
/// # Arguments
/// 
/// * `directory`: A reference to the `DirectoryEntry` to check.
/// * `entries`: A slice of `Entry` objects representing the current state of directories.
/// 
/// returns: DirectoryChange
pub fn get_directory_change(directory: &DirectoryEntry, entries: &[Entry]) -> DirectoryChange {
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

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;
    use crate::utils::files::scan_directory::FileEntry;

    fn create_directory_entry(path: &str) -> DirectoryEntry {
        DirectoryEntry {
            path: PathBuf::from(path),
        }
    }

    fn create_file_entry(hash: &str, path: &str, size: u64) -> FileEntry {
        FileEntry {
            hash: hash.to_string(),
            path: PathBuf::from(path),
            size,
        }
    }

    #[test]
    fn test_directory_created_when_not_found() {
        let dir = create_directory_entry("new_dir");
        let entries = vec![
            Entry::Directory(create_directory_entry("existing_dir")),
            Entry::File(create_file_entry("abc", "some_file.txt", 123)),
        ];
        assert_eq!(get_directory_change(&dir, &entries), DirectoryChange::Created);
    }

    #[test]
    fn test_directory_unchanged_when_path_matches() {
        let dir = create_directory_entry("data");
        let entries = vec![
            Entry::File(create_file_entry("x", "file.txt", 111)),
            Entry::Directory(create_directory_entry("data")),
            Entry::Directory(create_directory_entry("archive")),
        ];
        assert_eq!(get_directory_change(&dir, &entries), DirectoryChange::Unchanged);
    }

    #[test]
    fn test_directory_created_with_empty_entries() {
        let dir = create_directory_entry("lonely_dir");
        let entries = vec![];
        assert_eq!(get_directory_change(&dir, &entries), DirectoryChange::Created);
    }

    #[test]
    fn test_directory_unchanged_among_many_entries() {
        let dir = create_directory_entry("target");
        let entries = vec![
            Entry::File(create_file_entry("1", "f1.txt", 10)),
            Entry::File(create_file_entry("2", "f2.txt", 20)),
            Entry::Directory(create_directory_entry("tmp")),
            Entry::Directory(create_directory_entry("target")), // this is the match
            Entry::Directory(create_directory_entry("bin")),
        ];
        assert_eq!(get_directory_change(&dir, &entries), DirectoryChange::Unchanged);
    }
}