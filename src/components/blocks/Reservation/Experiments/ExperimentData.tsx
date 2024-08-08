import Pill from "../../../primitives/Pills/Pill.tsx";
import H4 from "../../../primitives/headings/H4.tsx";

const ExperimentData = () => {
    return (
        <div className="rounded-lg border border-gray-300 p-6">
            <H4>Data</H4>
            <div className="flex flex-row gap-2"><strong>Status:</strong> <Pill title="Synchronizing" variant="primary" /></div>
            <div><strong>Loaded:</strong> 24.5 GB (245 Files)</div>
            <div><strong>Transferred:</strong> 19.6 GB (200 Files)</div>
        </div>
    )
}

export default ExperimentData;