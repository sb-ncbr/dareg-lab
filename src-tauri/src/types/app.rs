use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;
use crate::utils::config::Config;

pub struct AppData {
    pub config: Config,
}

pub enum Task {
    CreateFile(PathBuf),
    ModifyFile,
    MoveFile,
    DeleteFile,
    CreateDirectory(PathBuf),
    MoveDirectory,
    DeleteDirectory,
}

#[derive(Debug, PartialEq)]
pub enum Status {
    Idle,
    Running,
    Syncing,
}

pub struct State {
    pub scan_handle: Mutex<Option<JoinHandle<()>>>,
    pub upload_handle: Mutex<Option<JoinHandle<()>>>,
    pub tasks: Arc<Mutex<VecDeque<Task>>>,
    pub status: Arc<Mutex<Status>>,
    pub experiment_id: Arc<Mutex<String>>
}