import H4 from "../../../primitives/headings/H4.tsx";
import FilesDialog from "../../../dialog/FilesDialog.tsx";
import prettyBytes from 'pretty-bytes';
import {useEffect, useMemo, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import {FileType} from "../../../../types/files/FileEntry.ts";
import {DirectoryType} from "../../../../types/files/DirectoryEntry.ts";
import {FileEvent} from "../../../../types/files/FileEvent.ts";
import {SyncingFile} from "../../../../types/files/SyncingFile.ts";
import Pill from "../../../primitives/Pills/Pill.tsx";


interface ExperimentDataProps {
    onSuccess: (experimentId: string) => void;
    onError: (experimentId: string) => void;
}

const resolveTitle = (fileEntries: SyncingFile[]) => {
    if (fileEntries.length === 0) {
        return "No Data";
    }
    if (fileEntries.some(f => f.status === "Error")) {
        return "Error";
    }
    if (fileEntries.every(f => f.status === "Finished")) {
        return "Success";
    }
    return "Synchronizing";
}

const resolveEventOnSyncingFile = (event: FileEvent, f: SyncingFile): SyncingFile => {
    const file = {...f, progress: event.progress, status: event.status}
    if (file.status === "Started") {
        file.startedAt = new Date();
    }
    if (file.status === "Progress" || file.status === "Finished") {
        file.processAt = new Date();
    }

    if (file.startedAt != null && file.processAt != null && (file.processAt.valueOf() - file.startedAt.valueOf()) !== 0) {
        file.uploadSpeedEstimate = (file.progress * file.entry.size) / ((file.processAt.valueOf() - file.startedAt.valueOf()) / 1000)
    }

    return file;
}

const ExperimentData = ({onSuccess}: ExperimentDataProps) => {
    const [showFileStatus, setShowFileStatus] = useState(false);

    const [fileEntries, setFileEntries] = useState<SyncingFile[]>([]);
    const filesEventsToProcess = useRef<FileEvent[]>([])

    const {size, synchronized, synchronizedCount, totalCount, uploadSpeedEstimate} = useMemo(() => {
        const size = fileEntries.reduce((acc, f) => acc + f.entry.size, 0);
        const synchronized = fileEntries.reduce((acc, f) => acc + f.entry.size * f.progress, 0);
        const totalCount = fileEntries.length;
        const synchronizedCount = fileEntries.filter(f => f.status === "Finished").length;

        const uploadFiles = fileEntries.filter(f => f.status === "Progress" || f.status === "Finished").length;
        const uploadSpeedEstimate = uploadFiles > 0 ? (fileEntries.reduce((acc, f) => acc + (f.uploadSpeedEstimate ?? 0), 0) / uploadFiles) : 0;
        return {size, synchronized, totalCount, synchronizedCount, uploadSpeedEstimate};
    }, [fileEntries])

    useEffect(() => {
        const unlisten = listen<string>('files-scanned', (event) => {
            const filesOrDirectories = event.payload as unknown as (FileType | DirectoryType)[];
            const files = filesOrDirectories.filter(f => "File" in f).map(f => (f as FileType).File)
            const filesToAdd: SyncingFile[] = files.filter(f => !fileEntries.some(e => e.entry.path === f.path)).map(f => ({
                entry: f,
                status: "Loaded",
                progress: 0,
                processAt: null,
                startedAt: null,
                uploadSpeedEstimate: null
            }));

            setFileEntries([...fileEntries, ...filesToAdd]);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, [setFileEntries, fileEntries]);

    useEffect(() => {
        const unlisten = listen<string>('file-event', (event) => {
            const parsedEvent = event.payload as unknown as FileEvent;
            filesEventsToProcess.current.push(parsedEvent);
        });
        return () => {
            unlisten.then(f => f());
        };
    }, [setFileEntries]);

    useEffect(() => {
        const handle = setInterval(() => {
            const events = [...filesEventsToProcess.current];
            filesEventsToProcess.current = [];

            for (const event of events) {
                setFileEntries(prevEntries =>
                    prevEntries.map(f => {
                            return f.entry.path === event.path
                                ? resolveEventOnSyncingFile(event, f)
                                : f;
                        }
                    )
                );
            }
        }, 500)

        return () => {
            clearInterval(handle);
        }
    }, [setFileEntries]);

    useEffect(() => {
        const unlisten = listen<string>('files-upload-confirmation', (event) => {
            const experimentId = event.payload as string;
            onSuccess(experimentId);
            setFileEntries([]);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, [onSuccess, setFileEntries]);


    return (
        <div className="rounded-lg border border-gray-300 p-4 relative">
            <H4>Data Information</H4>
            <div className="flex flex-row gap-2 items-center"><strong>Status:</strong> <Pill
                title={resolveTitle(fileEntries)} variant="primary" size="small"/></div>
            <div><strong>Loaded:</strong> {prettyBytes(size)} ({totalCount} Files)</div>
            <div><strong>Transferred:</strong> {prettyBytes(synchronized)} ({synchronizedCount} Files)</div>
            <div><strong>Upload
                speed</strong> (estimate): {!Number.isNaN(uploadSpeedEstimate) ? prettyBytes(uploadSpeedEstimate) : "None"} /
                s
            </div>
            <div className="absolute right-6 top-6 underline cursor-pointer" onClick={() => setShowFileStatus(true)}>
                File Status
            </div>
            {/* setDialog not used on purpose, need for data to files dialog */}
            {showFileStatus && <FilesDialog fileEntries={fileEntries} onClose={() => setShowFileStatus(false)}/>}
        </div>
    )
}

export default ExperimentData;