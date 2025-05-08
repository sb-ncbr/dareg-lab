use crate::types::files::CreateFileResponse;
use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use std::io::{self};
use std::path::Path;
use log::info;

pub async fn create_file_at_path(
    path: &Path,
    token: &String,
    provider_url: &String,
    space_id: &str,
) -> Result<CreateFileResponse, Box<dyn std::error::Error>> {
    // Set up the headers
    let mut headers = HeaderMap::new();
    headers.insert("X-Auth-Token", HeaderValue::try_from(format!("{}", token))?);
    headers.insert(
        CONTENT_TYPE,
        HeaderValue::from_static("application/octet-stream"),
    );

    let client = reqwest::Client::new();
    // Define the endpoint URL
    let url = format!(
        "{}/data/{}/path/{}",
        provider_url,
        space_id,
        path.to_string_lossy(),
    );

    // Upload the chunk
    let response = client.put(&url).headers(headers.clone()).send().await?;

    if response.status().is_success() {
        // Parse the JSON response
        let response_text = response.text().await?;
        let parsed_response: CreateFileResponse = serde_json::from_str(&response_text)?;

        info!(
            "File {} created successfully with ID: {}",
            path.file_name().unwrap().to_string_lossy(),
            parsed_response.file_id
        );

        Ok(parsed_response)
    } else {
        let response_text = response.text().await?;
        Err(Box::new(io::Error::new(
            io::ErrorKind::Other,
            format!("Failed to create file: {}", response_text),
        )))
    }
}
