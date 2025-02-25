use crate::utils::files::scan_directory::{DirectoryEntry, Entry};

#[derive(Debug, PartialEq)]
pub enum DirectoryChange {
    Created,
    // Moved,
    Unchanged,
    // Deleted, needs to be handled separately
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