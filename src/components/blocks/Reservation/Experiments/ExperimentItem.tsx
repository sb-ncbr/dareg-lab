import Pill, {PillVariant} from "../../../primitives/Pills/Pill.tsx";
import {twMerge} from "tailwind-merge";
import {Button} from "@headlessui/react";
import {XMarkIcon} from "@heroicons/react/24/solid";
import Skeleton from "../../../primitives/skeleton/Skeleton.tsx";
import {Experiment, ExperimentStatusEnum} from "../../../../api.ts";
import CircularLoader from "../../../primitives/loaders/CircularLoader.tsx";
import {cva} from "class-variance-authority";
import {ReactNode} from "react";
import {
    ArrowPathIcon,
    CheckIcon,
    ExclamationCircleIcon,
    ServerStackIcon,
    SparklesIcon, TrashIcon
} from "@heroicons/react/24/outline";
import {useSetDialog} from "../../../../contexts/DialogContextProvider.tsx";
import ConfirmDiscardExperimentDialog from "../../../dialog/ConfirmDiscardExperimentDialog.tsx";


interface ExperimentProps {
    experiment: Experiment;
    onDelete: () => void;
    onSelect: () => void;
    selected: boolean;
    deleting: boolean;
}

const resolvePillVariant = (state: ExperimentStatusEnum): { pill: PillVariant, icon: ReactNode } => {
    switch (state) {
        case "running":
            return {
                pill: "inverted",
                icon: <ArrowPathIcon className="h-6 w-6 text-inherit animate-spin" strokeWidth="2"/>
            }
        case "success":
            return {pill: "success", icon: <ServerStackIcon className="h-6 w-6 text-inherit" strokeWidth="2"/>}
        case "failure":
            return {pill: "error", icon: <ExclamationCircleIcon className="h-6 w-6 text-inherit" strokeWidth="2"/>}
        case "discarded":
            return {pill: "error", icon: <TrashIcon className="h-6 w-6 text-inherit" strokeWidth="2"/>}
        case "prepared":
            return {pill: "primary", icon: <CheckIcon className="h-6 w-6 text-inherit" strokeWidth="2"/>}
        case "new":
            return {pill: "primary", icon: <SparklesIcon className="h-6 w-6 text-inherit" strokeWidth="1.7"/>}
        case "synchronizing":
            return {
                pill: "primary",
                icon: <ArrowPathIcon className="h-6 w-6 text-inherit animate-spin" strokeWidth="2"/>
            }
    }
}

const ExperimentItemVariants = cva(
    ["rounded-lg", "flex", "flex-row", "items-center", "p-2", "gap-2", "group", "cursor-pointer", "border"],
    {
        variants: {
            status: {
                running: ["border-none", "bg-cyan-500"],
                success: ["border-gray-300"],
                failure: ["border-gray-300"],
                prepared: ["border-gray-300"],
                new: ["border-gray-300"],
                synchronizing: ["border-gray-300"],
                discarded: ["border-gray-300"],
                deleted: [], // should be not displayed
            },
            selected: {
                true: ["border-2", "border-cyan-500"],
            }
        },
        defaultVariants: {
            status: "new"
        }
    });

const ExperimentItem = ({experiment, onDelete, onSelect, deleting, selected}: ExperimentProps) => {
    const {status} = experiment;
    const {pill, icon} = resolvePillVariant(status!);
    const setDialog = useSetDialog();
    return (
        <div
            className={twMerge(ExperimentItemVariants({status, selected}))}
            onClick={onSelect}
        >
            <Pill
                title={icon}
                variant={pill}
                className="w-10 text-center truncate"
            />
            {experiment.name !== "" ? <span>{experiment.name}</span> : <Skeleton className="w-32 h-6"/>}
            <Button className="group-hover:opacity-100 opacity-0 size-6 text-red-600 ml-auto" onClick={e => {
                e.stopPropagation();
                setDialog(<ConfirmDiscardExperimentDialog experiment={experiment} onDiscard={() => {
                    onDelete();
                    setDialog(null);
                }}/>);
            }}>
                {deleting
                    ? <CircularLoader className="text-cyan-500"/>
                    : <XMarkIcon color="size-6"/>
                }
            </Button>
        </div>
    )
}

export default ExperimentItem;