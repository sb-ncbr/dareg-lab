use crate::utils::files::calculate_checksum::calculate_checksum;
use serde::Serialize;
use std::collections::VecDeque;
use std::fs;
#[cfg(target_family = "unix")]
#[allow(unused_imports)]
use std::os::unix::fs::MetadataExt;
#[cfg(target_family = "windows")]
#[allow(unused_imports)]
use std::os::windows::fs::MetadataExt;
use std::path::{Path, PathBuf};

#[derive(Serialize, Clone, PartialEq, Debug)]
pub struct FileEntry {
    pub hash: String,
    pub path: PathBuf,
    pub size: u64,
}

#[derive(Serialize, Clone, PartialEq, Debug)]
pub struct DirectoryEntry {
    pub path: PathBuf,
}

#[derive(Serialize, Clone, PartialEq, Debug)]
pub enum Entry {
    File(FileEntry),
    Directory(DirectoryEntry),
}

/// Scans a directory and its subdirectories, returning a vector of entries.
///
/// # Arguments
///
/// * `directory`: A path to the directory to scan.
///
/// returns: VecDeque<Entry>
pub async fn scan_directory(directory: &Path) -> VecDeque<Entry> {
    let mut files = VecDeque::new();
    let mut buf = VecDeque::new();
    buf.push_back(directory.to_path_buf());

    while let Some(path) = buf.pop_front() {
        let entries = match fs::read_dir(&path) {
            Ok(entries) => entries,
            Err(err) => {
                eprintln!("Failed to read directory {:?}: {}", path, err);
                continue;
            }
        };

        for entry in entries {
            let entry = match entry {
                Ok(entry) => entry,
                Err(err) => {
                    eprintln!("Failed to read entry: {}", err);
                    continue;
                }
            };

            let path = entry.path();
            let metadata = match fs::metadata(&path) {
                Ok(metadata) => metadata,
                Err(err) => {
                    eprintln!("Failed to read metadata for {:?}: {}", path, err);
                    continue;
                }
            };

            if metadata.is_file() {
                match calculate_checksum(&path) {
                    Ok(checksum) => {
                        files.push_back(Entry::File(FileEntry {
                            path: path.clone(),
                            hash: checksum,
                            size: metadata.len(),
                        }));
                    }
                    Err(err) => {
                        eprintln!("Failed to calculate checksum for {:?}: {}", path, err);
                    }
                }
            } else if metadata.is_dir() {
                files.push_back(Entry::Directory(DirectoryEntry { path: path.clone() }));
                buf.push_back(path.clone());
            } else {
                println!("Other: {:?}", path);
            }
        }
    }
    files
}
