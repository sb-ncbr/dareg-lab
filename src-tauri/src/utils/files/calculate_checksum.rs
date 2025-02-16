use std::fs;
use std::path::Path;

use sha2::{Digest, Sha256};
use std::io::{self, Read};

/// Calculates the checksum of a file.
///
/// # Arguments
///
/// * `path`:
///
/// returns: Result<String, Error>
///
/// # Examples
///
/// ```
///
/// ```
pub fn calculate_checksum(path: &Path) -> io::Result<String> {
    let mut file = fs::File::open(path)?;
    let mut hasher = Sha256::new();
    let mut buffer = [0u8; 1024];

    loop {
        let bytes_read = file.read(&mut buffer)?;
        if bytes_read == 0 {
            break;
        }
        hasher.update(&buffer[..bytes_read]);
    }

    Ok(format!("{:x}", hasher.finalize()))
}
