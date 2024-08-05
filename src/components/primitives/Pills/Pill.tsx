import {twMerge} from "tailwind-merge";

interface PillProps {
    title: string;
    variant: "primary" | "inverted" | "secondary";
}

const Pill = ({variant, title}: PillProps) => {
    console.log(variant)
    return <div className={twMerge("rounded px-2 py-0 bg-cyan-500 text-white")}>{title}</div>
}

export default Pill;