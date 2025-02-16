import H4 from "../../../primitives/headings/H4.tsx";
import FilesDialog from "../../../dialog/FilesDialog.tsx";
import prettyBytes from 'pretty-bytes';
import {useEffect, useRef, useState} from "react";
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

const ExperimentData = ({onSuccess}: ExperimentDataProps) => {
    const [showFileStatus, setShowFileStatus] = useState(false);

    const [fileEntries, setFileEntries] = useState<SyncingFile[]>([]);
    const filesEventsToProcess = useRef<FileEvent[]>([])

    const size = fileEntries.reduce((acc, f) => acc + f.entry.size, 0);
    const synchronized = fileEntries.reduce((acc, f) => acc + f.entry.size * f.progress, 0);
    const totalCount = fileEntries.length;
    const synchronizedCount = fileEntries.filter(f => f.status === "Finished").length;

    useEffect(() => {
        const unlisten = listen<string>('files-scanned', (event) => {
            const filesOrDirectories = event.payload as unknown as (FileType | DirectoryType)[];
            const files = filesOrDirectories.filter(f => "File" in f).map(f => (f as FileType).File)
            const filesToAdd: SyncingFile[] = files.filter(f => !fileEntries.some(e => e.entry.path === f.path)).map(f => ({entry: f, status: "Loaded", progress: 0}));

            setFileEntries([...fileEntries, ...filesToAdd]);
        });

        return () => {
            unlisten.then(f => f());
        };
    }, [setFileEntries, fileEntries]);

    useEffect(() => {
        console.log("Listening for file events");
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
                                ? {...f, progress: event.progress, status: event.status}
                                : f;
                        }
                    )
                );
            }
        }, 1000)

        return () => {
            clearInterval(handle);
        }
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
            <div className="flex flex-row gap-2"><strong>Status:</strong> <Pill title={resolveTitle(fileEntries)} variant="primary" /></div>
            <div><strong>Loaded:</strong> {prettyBytes(size)} ({totalCount} Files)</div>
            <div><strong>Transferred:</strong> {prettyBytes(synchronized)} ({synchronizedCount} Files)</div>
            <div className="absolute right-6 top-6 underline cursor-pointer" onClick={() => setShowFileStatus(true)}>
                File Status
            </div>
            {/* setDialog not used on purpose, need for data to files dialog */}
            {showFileStatus && <FilesDialog fileEntries={fileEntries} onClose={() => setShowFileStatus(false)}/>}
        </div>
    )
}

export default ExperimentData;