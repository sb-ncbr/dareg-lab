use serde::Deserialize;

#[derive(Deserialize)]
pub struct CreateFileResponse {
    #[serde(rename(deserialize = "fileId"))]
    pub file_id: String,
}
