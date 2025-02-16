import Button from "../primitives/buttons/Button.tsx";
import BaseDialog from "./BaseDialog.tsx";
import FileCard from "../blocks/File/FileCard.tsx";
import {SyncingFile} from "../../types/files/SyncingFile.ts";

interface FilesDialogProps {
    fileEntries: SyncingFile[];
    onClose: () => void;
}

const FilesDialog = ({fileEntries, onClose}: FilesDialogProps) => {
    return (
        <BaseDialog
            title="Files"
            content={
                <div className="flex flex-col gap-2">
                    {fileEntries.map((fileEntry, idx) => (
                        <FileCard key={idx} fileEntry={fileEntry} />
                    ))}
                </div>}
            buttons={
                <div className="flex flex-row-reverse gap-4">
                    <Button type="submit" onClick={onClose}>
                        Close
                    </Button>
                </div>
            }
            overrideClose={onClose}
        />
    )
}

export default FilesDialog;