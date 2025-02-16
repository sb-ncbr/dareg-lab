use serde::Deserialize;

#[derive(Deserialize)]
pub struct UploadParameters {
    pub token: String,
    pub provider_url: String,
    pub one_data_directory_id: String,
}
