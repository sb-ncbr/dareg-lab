export type Status = "Started" | "Finished" | "Progress" | "Error";

export interface FileEvent {
    path: string,
    status: Status,
    progress: number,
}
