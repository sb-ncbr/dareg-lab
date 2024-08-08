import {twMerge} from "tailwind-merge";

export type PillVariant = "primary" | "inverted" | "secondary" | "error";

interface PillProps {
    title: string;
    variant: PillVariant;
}

const resolveVariant = (variant: PillProps["variant"]) => {
    switch (variant) {
        case "primary":
            return "bg-cyan-500 text-white";
        case "inverted":
            return "bg-white text-cyan-500";
        case "secondary":
            return "bg-cyan-300 text-black";
    }
}

const Pill = ({variant, title}: PillProps) => {
    const classes = resolveVariant(variant);
    return <div className={twMerge("rounded px-2 py-0", classes)}>{title}</div>
}

export default Pill;