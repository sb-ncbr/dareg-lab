use crate::utils::files::scan_directory::{Entry, FileEntry};

#[derive(Debug, PartialEq)]
pub enum FileChange {
    Created,
    Modified,
    // Moved,
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