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


#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::NamedTempFile;
    use std::io::{Write};
    use sha2::{Sha256, Digest};

    #[test]
    fn test_calculate_checksum_correctly() {
        // Create a temporary file with known content
        let mut temp_file = NamedTempFile::new().expect("Failed to create temp file");
        let file_content = b"Hello, world!";
        temp_file.write_all(file_content).expect("Failed to write to temp file");

        // Rewind the file to the beginning before calculating checksum
        let file_path = temp_file.path();
        let expected_checksum = Sha256::digest(file_content);
        let expected_checksum_hex = format!("{:x}", expected_checksum);

        // Test the checksum calculation
        let result = calculate_checksum(file_path);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_checksum_hex);
    }

    #[test]
    fn test_calculate_checksum_file_not_found() {
        // Test for a non-existent file
        let non_existent_file = Path::new("non_existent_file.txt");
        let result = calculate_checksum(non_existent_file);
        assert!(result.is_err());
    }

    #[test]
    fn test_calculate_checksum_empty_file() {
        // Create an empty temporary file
        let temp_file = NamedTempFile::new().expect("Failed to create temp file");

        // Test for an empty file (checksum should be the hash of an empty string)
        let expected_checksum = Sha256::digest(b"");
        let expected_checksum_hex = format!("{:x}", expected_checksum);

        let file_path = temp_file.path();

        // Test the checksum calculation
        let result = calculate_checksum(file_path);
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), expected_checksum_hex);
    }
}