import Pill, {PillVariant} from "../../../primitives/Pills/Pill.tsx";
import {twMerge} from "tailwind-merge";
import {Button} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/solid";
import Skeleton from "../../../primitives/skeleton/Skeleton.tsx";
import {capitalizeFirstLetters} from "../../../../utils/format.ts";
import ExperimentState from "../../../../types/experiments/ExperimentState.ts";
import IExperiment from "../../../../types/experiments/Experiment.ts";


interface ExperimentProps {
    experiment: IExperiment;
    onDelete: () => void;
    onSelect: () => void;
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
        case "new":
            return {
                pill: "secondary",
                classes: ""
            };
    }
}

const Experiment = ({experiment, onDelete, onSelect}: ExperimentProps) => {
    const {state} = experiment;
    const {pill, classes} = resolveState(state);
    return (
        <div
            className={twMerge("rounded-lg flex flex-row items-center p-2 gap-2 group cursor-pointer", classes, state !== "active" ? "border border-gray-300" : "")}
            onClick={onSelect}
        >
            <Pill title={capitalizeFirstLetters(state)} variant={pill}/>
            {experiment.name !== "" ? <span>{experiment.name}</span> : <Skeleton className="w-32 h-6"/>}
            <Button className="group-hover:opacity-100 opacity-0 size-6 text-red-600" onClick={onDelete}>
                <XMarkIcon color="size-6"/>
            </Button>
        </div>
    )
}

export default Experiment;