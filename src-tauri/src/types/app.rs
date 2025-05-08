use crate::utils::config::Config;
use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::Arc;
use tokio::sync::Mutex;
use tokio::task::JoinHandle;

pub struct AppData {
    pub config: Config,
}

#[derive(Debug)]
pub enum Task {
    CreateFile(PathBuf),
    ModifyFile(PathBuf),
    // MoveFile(PathBuf),
    DeleteFile(PathBuf),
    CreateDirectory(PathBuf),
    // MoveDirectory(PathBuf),
    DeleteDirectory(PathBuf),
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
    pub experiment_id: Arc<Mutex<String>>,
}
