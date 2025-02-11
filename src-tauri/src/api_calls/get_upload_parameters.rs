
use reqwest::header::{HeaderMap, HeaderValue};
use std::io::{self};
use crate::types::upload_parameters::UploadParameters;

/// Function to create temporary token for a dataset upload. Token is short-lived and constraint to experiment folder.
///
/// # Arguments
///
/// * `experiment_id`: ID of the experiment to generate upload parameters
/// * `dareg_url`: URL of the DAREG server
/// * `device_token`: Device token to authenticate the request
///
/// returns: Result<TempToken, Box<dyn Error, Global>>
///
/// # Examples
///
/// ```
///
/// ```
pub async fn get_upload_parameters(
    experiment_id: &str,
    dareg_url: &str,
    device_token: &str,
) -> Result<UploadParameters, Box<dyn std::error::Error>> {
    // Set up the headers
    let mut headers = HeaderMap::new();
    headers.insert("Authorization", HeaderValue::try_from(format!("Token {}", device_token))?);

    let client = reqwest::Client::new();
    // Define the endpoint URL
    let url = format!(
        "{dareg_url}/api/v1/temp-token/{experiment_id}/",
    );

    // Upload the chunk
    let response = client
        .post(&url)
        .headers(headers.clone())
        .send().await?;

    if response.status().is_success() {
        // Parse the JSON response
        let response_text = response.text().await?;
        let parsed_response: UploadParameters = serde_json::from_str(&response_text)?;

        Ok(parsed_response)
    } else {
        let response_text = response.text().await?;
        Err(Box::new(io::Error::new(
            io::ErrorKind::Other,
            format!("Failed to create file. Error: {}", response_text),
        )))
    }
}
