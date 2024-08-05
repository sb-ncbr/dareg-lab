import Pill from "../../../primitives/Pills/Pill.tsx";


interface ExperimentProps {
    state: "active" | "done" | "failed" | "prepared";
}

const Experiment = ({state}: ExperimentProps) => {
    console.log(state)
    return (
        <div className="rounded-lg border border-gray-300 flex flex-row items-center p-6 gap-6">
            <Pill title="Active" variant="primary" />
            Experiment 123
        </div>
    )
}

export default Experiment;