import Pill from "../../primitives/Pills/Pill.tsx";
import FileEntry from "../../../types/files/FileEntry.ts";
import prettyBytes from "pretty-bytes";

interface FileCardProps {
    fileEntry: FileEntry;
}

const FileCard = ({fileEntry}: FileCardProps) => {
    const filename = fileEntry.path.split("/").pop();
    return (
        <div className="flex flex-col">
            <h4 className="text-lg font-semibold">{filename}</h4>
            <small>{fileEntry.path}</small>
            <div className="flex flex-row gap-2">
                <span>{prettyBytes(fileEntry.size)} / 588 MB</span>
                <Pill title="Synchronizing" variant="primary" />
            </div>
        </div>
    )
}

export default FileCard;