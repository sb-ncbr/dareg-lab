export interface FileEntry {
    path: string,
    hash: string,
    size: number,
}

export interface FileType {
    File: FileEntry
}