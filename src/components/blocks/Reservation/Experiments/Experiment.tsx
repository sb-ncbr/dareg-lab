import Pill, {PillVariant} from "../../../primitives/Pills/Pill.tsx";
import {twMerge} from "tailwind-merge";


export type ExperimentState = "active" | "done" | "failed" | "prepared";

interface ExperimentProps {
    state: ExperimentState;
}

const resolveState = (state: ExperimentState): { pill: PillVariant, classes: string } => {
    switch (state) {
        case "active":
            return {
                pill: "inverted",
                classes: "bg-cyan-500"
            };
        case "done":
            return {
                pill: "primary",
                classes: ""
            };
        case "failed":
            return {
                pill: "error",
                classes: ""
            };
        case "prepared":
            return {
                pill: "secondary",
                classes: ""
            };
    }
}

const Experiment = ({state}: ExperimentProps) => {
    const {pill, classes} = resolveState(state);
    return (
        <div
            className={twMerge("rounded-lg flex flex-row items-center p-2 gap-2 cursor-pointer", classes, state !== "active" ? "border border-gray-300" : "")}>
            <Pill title="Active" variant={pill}/>
            Experiment 123
        </div>
    )
}

export default Experiment;