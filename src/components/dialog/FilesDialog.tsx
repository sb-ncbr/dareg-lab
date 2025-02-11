import Button from "../primitives/buttons/Button.tsx";
import BaseDialog from "./BaseDialog.tsx";
import FileCard from "../blocks/File/FileCard.tsx";
import FileEntry from "../../types/files/FileEntry.ts";

interface FilesDialogProps {
    fileEntries: FileEntry[];
}

const FilesDialog = ({fileEntries}: FilesDialogProps) => {

    return (
        <BaseDialog
            title="Files"
            content={
                <div className="flex flex-col gap-2">
                    {fileEntries.map((fileEntry) => (
                        <FileCard key={fileEntry.hash} fileEntry={fileEntry} />
                    ))}
                </div>}
            buttons={
                <div className="flex flex-row-reverse gap-4">
                    <Button type="submit">
                        Close
                    </Button>
                </div>
            }/>
    )
}

export default FilesDialog;