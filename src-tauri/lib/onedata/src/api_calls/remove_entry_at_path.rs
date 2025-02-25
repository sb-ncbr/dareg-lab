use reqwest::header::{HeaderMap, HeaderValue, CONTENT_TYPE};
use std::io::{self};
use std::path::Path;

pub async fn remove_entry_at_path(
    path: &Path,
    token: &String,
    provider_url: &String,
    space_id: &str,
) -> Result<(), Box<dyn std::error::Error>> {
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
    let response = client.delete(&url).headers(headers.clone()).send().await?;

    if response.status().is_success() {

        println!(
            "Entry {} removed successfully",
            path.file_name().unwrap().to_string_lossy(),
        );
        Ok(())
    } else {
        let response_text = response.text().await?;
        Err(Box::new(io::Error::new(
            io::ErrorKind::Other,
            format!("Failed to create file {}", response_text),
        )))
    }
}
