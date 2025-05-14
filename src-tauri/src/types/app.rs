use std::collections::VecDeque;
use std::path::PathBuf;
use std::sync::Arc;
use serde::{Deserialize, Serialize};
use tokio::sync::Mutex;
use tokio::task::JoinHandle;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Config {
    pub token: String,
    pub dareg_url: String,
}

pub struct AppData {
    pub config: Config,
}

#[derive(Debug)]
pub enum Task {
    CreateFile(PathBuf),
    ModifyFile(PathBuf),
    DeleteFile(PathBuf),
    CreateDirectory(PathBuf),
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
