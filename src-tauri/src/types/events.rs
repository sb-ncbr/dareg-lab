use std::path::PathBuf;
use serde::Serialize;

#[derive(Serialize, Clone)]
pub enum FileEventStatus {
    Started,
    Finished,
    Progress,
    // Error,
}
#[derive(Serialize, Clone)]
pub struct FileEvent {
    pub path: PathBuf,
    pub status: FileEventStatus,
    pub progress: f32,
}
