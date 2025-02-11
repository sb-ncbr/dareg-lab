use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use std::fs::File;
use std::io::{self, Read, Seek, SeekFrom};

/// Uploads a file in chunks to the specified endpoint.
///
/// # Arguments
/// * `file_path` - The path to the file to upload.
/// * `token` - The authentication token.
/// * `provider_host` - The provider host.
/// * `file_id` - The ID of the file on the server.
/// * `chunk_size` - The size of each chunk to upload (default is 10MB).
///
pub async fn upload_file_in_chunks(
    file_path: &str,
    token: &String,
    provider_host: &String,
    file_id: &str,
    chunk_size: usize,
) -> Result<(), Box<dyn std::error::Error>> {
    // Open the file
    let mut file = File::open(file_path)?;

    // Get the total size of the file
    let file_size = file.metadata()?.len();

    // Set up the headers
    let mut headers = HeaderMap::new();
    headers.insert("X-Auth-Token", HeaderValue::try_from(format!("{}", token))?);
    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_static("application/octet-stream"),
    );

    let client = reqwest::Client::new();
    let mut offset = 0;
    let mut buffer = vec![0; chunk_size];

    while offset < file_size {
        // Determine how many bytes to read (last chunk might be smaller)
        let bytes_to_read = std::cmp::min(chunk_size as u64, file_size - offset) as usize;

        // Read the chunk into the buffer
        file.seek(SeekFrom::Start(offset))?;
        file.read_exact(&mut buffer[..bytes_to_read])?;

        // Define the endpoint URL
        let url = format!(
            "{}/data/{}/content?offset={}",
            provider_host, file_id, offset
        );

        // Upload the chunk
        let response = client
            .put(&url)
            .headers(headers.clone())
            .body(buffer[..bytes_to_read].to_vec())
            .send()
            .await?;

        if response.status().is_success() {
            println!(
                "Uploaded chunk at offset {} ({} bytes)",
                offset, bytes_to_read
            );
        } else {
            let response_text = response.text().await?;
            return Err(Box::new(io::Error::new(
                io::ErrorKind::Other,
                format!("Failed to upload chunk"),
            )));
        }

        // Update the offset
        offset += bytes_to_read as u64;
    }

    println!("File uploaded successfully!");
    Ok(())
}
