import Pill from "../../primitives/Pills/Pill.tsx";

const FileCard = () => {
    return (
        <div className="flex flex-col">
            <h4 className="text-lg font-semibold">sample_202426252585.json</h4>
            <div className="flex flex-row gap-2">
                <span>300 MB / 588 MB</span>
                <Pill title="Synchronizing" variant="primary" />
            </div>
        </div>
    )
}

export default FileCard;