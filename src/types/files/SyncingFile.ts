import {FileEntry} from "./FileEntry.ts";

export interface SyncingFile {
    entry: FileEntry;
    progress: number;
    status: "Loaded" | "Started" | "Finished" | "Progress" | "Error";
}