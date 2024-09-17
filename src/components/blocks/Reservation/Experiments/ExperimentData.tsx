import Pill from "../../../primitives/Pills/Pill.tsx";
import H4 from "../../../primitives/headings/H4.tsx";
import {useSetDialog} from "../../../../contexts/DialogContextProvider.tsx";
import FilesDialog from "../../../dialog/FilesDialog.tsx";
import FileStatus from "../../../../types/files/FileStatus.ts";
import {reduceFileSize} from "../../../../utils/files.ts";
import prettyBytes from 'pretty-bytes';


interface ExperimentDataProps {
    fileStatus: FileStatus | null;
}

const resolveTitle = (fileStatus: FileStatus | null) => {
    if (fileStatus == null) {
        return "No Data";
    }
    if (fileStatus.files.some(f => f.status === "Error")) {
        return "Error";
    }
    if (fileStatus.files.every(f => f.status === "Success")) {
        return "Success";
    }
    return "Synchronizing";
}

const ExperimentData = ({fileStatus}: ExperimentDataProps) => {
    const setDialog = useSetDialog();

    const size = reduceFileSize("size", fileStatus?.files || []);
    const synchronized = reduceFileSize("synchronized", fileStatus?.files || []);
    const totalCount = fileStatus?.files.length || 0;
    const synchronizedCount = fileStatus?.files.filter(f => f.status === "Success").length || 0;

    return (
        <div className="rounded-lg border border-gray-300 p-6 relative">
            <H4>Data</H4>
            <div className="flex flex-row gap-2"><strong>Status:</strong> <Pill title={resolveTitle(fileStatus)} variant="primary" /></div>
            <div><strong>Loaded:</strong> {prettyBytes(size)} ({totalCount} Files)</div>
            <div><strong>Transferred:</strong> {prettyBytes(synchronized)} ({synchronizedCount} Files)</div>
            <div className="absolute right-6 top-6 underline cursor-pointer" onClick={() => setDialog(<FilesDialog />)}>
                File Status
            </div>
        </div>
    )
}

export default ExperimentData;