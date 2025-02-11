import H4 from "../../../primitives/headings/H4.tsx";
import {useSetDialog} from "../../../../contexts/DialogContextProvider.tsx";
import FilesDialog from "../../../dialog/FilesDialog.tsx";
import prettyBytes from 'pretty-bytes';
import {useEffect, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import FileEntry from "../../../../types/files/FileEntry.ts";
import {reduceFileSize} from "../../../../utils/files.ts";


interface ExperimentDataProps {
    onSuccess: (experimentId: string) => void;
    onError: (experimentId: string) => void;
}

// const resolveTitle = (fileStatus: FileStatus | null) => {
//     if (fileStatus == null) {
//         return "No Data";
//     }
//     if (fileStatus.files.some(f => f.status === "Error")) {
//         return "Error";
//     }
//     if (fileStatus.files.every(f => f.status === "Success")) {
//         return "Success";
//     }
//     return "Synchronizing";
// }

const ExperimentData = ({onSuccess}: ExperimentDataProps) => {
    const setDialog = useSetDialog();
    const [fileEntries, setFileEntries] = useState<FileEntry[]>([]);

    const size = reduceFileSize("size", fileEntries);
    // const synchronized = reduceFileSize("synchronized", fileStatus?.files || []);
    const totalCount = fileEntries.length;
    // const synchronizedCount = fileStatus?.files.filter(f => f.status === "Success").length || 0;

    useEffect(() => {
        const unlisten = listen<string>('files-scanned', (event) => {
            setFileEntries(event.payload as unknown as FileEntry[]);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);


    useEffect(() => {
        const unlisten = listen<string>('files-upload-confirmation', (event) => {
            const experimentId = event.payload as string;
            onSuccess(experimentId);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, []);


    return (
        <div className="rounded-lg border border-gray-300 p-6 relative">
            <H4>Data</H4>
            {/*<div className="flex flex-row gap-2"><strong>Status:</strong> <Pill title={resolveTitle(fileStatus)} variant="primary" /></div>*/}
            <div><strong>Loaded:</strong> {prettyBytes(size)} ({totalCount} Files)</div>
            {/*<div><strong>Transferred:</strong> {prettyBytes(synchronized)} ({synchronizedCount} Files)</div>*/}
            <div className="absolute right-6 top-6 underline cursor-pointer" onClick={() => setDialog(<FilesDialog fileEntries={fileEntries} />)}>
                File Status
            </div>
        </div>
    )
}

export default ExperimentData;