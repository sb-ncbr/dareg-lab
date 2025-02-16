import Pill from "../../primitives/Pills/Pill.tsx";
import prettyBytes from "pretty-bytes";
import {SyncingFile} from "../../../types/files/SyncingFile.ts";

interface FileCardProps {
    fileEntry: SyncingFile;
}

const FileCard = ({fileEntry}: FileCardProps) => {
    const filename = fileEntry.entry.path.split("/").pop();
    return (
        <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{filename}</h4>
            <small>{fileEntry.entry.path}</small>
            <div className="flex flex-row gap-2">
                <span>{prettyBytes(fileEntry.entry.size * fileEntry.progress)} / {prettyBytes(fileEntry.entry.size)}</span>
                <Pill title={fileEntry.status} variant="primary" />
            </div>
        </div>
    )
}

export default FileCard;