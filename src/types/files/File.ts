import Status from "./Status.ts";

export default interface File {
    file: string,
    size: number,
    synchronized: number,
    status: Status,
}