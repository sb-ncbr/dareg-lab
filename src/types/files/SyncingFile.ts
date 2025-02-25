import {FileEntry} from "./FileEntry.ts";

export interface SyncingFile {
    entry: FileEntry;
    progress: number;
    startedAt: Date | null;
    processAt: Date | null;
    uploadSpeedEstimate: number | null;
    status: "Loaded" | "Started" | "Finished" | "Progress" | "Error";
}