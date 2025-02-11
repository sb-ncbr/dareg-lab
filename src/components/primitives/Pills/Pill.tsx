import {twMerge} from "tailwind-merge";
import {ReactNode} from "react";

export type PillVariant = "primary" | "inverted" | "secondary" | "error" | "success";

interface PillProps {
    title: ReactNode;
    variant: PillVariant;
    className?: string;
}

const resolveVariant = (variant: PillProps["variant"]) => {
    switch (variant) {
        case "primary":
            return "bg-cyan-500 text-white";
        case "inverted":
            return "bg-white text-cyan-500";
        case "secondary":
            return "bg-cyan-300 text-black";
        case "success":
            return "bg-green-500 text-white";
        case "error":
            return "bg-red-500 text-white";
    }
}

const Pill = ({variant, title, className}: PillProps) => {
    const classes = resolveVariant(variant);
    return <div className={twMerge("rounded px-2 py-1", classes, className)}>{title}</div>
}

export default Pill;