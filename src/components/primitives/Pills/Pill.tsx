import {twMerge} from "tailwind-merge";
import {ReactNode} from "react";
import {cva, VariantProps} from "class-variance-authority";


const pillVariants = cva([
    "rounded",
], {
    variants: {
        variant: {
            primary: "bg-cyan-500 text-white",
            inverted: "bg-white text-cyan-500",
            secondary: "bg-cyan-300 text-black",
            success: "bg-green-500 text-white",
            error: "bg-red-500 text-white",
        },
        size: {
            small: "text-xs px-1 py-0.5",
            medium: "text-sm px-2 py-1",
            large: "text-lg"
        }
    },
    defaultVariants: {
        size: "medium"
    }
})

interface PillProps extends VariantProps<typeof pillVariants> {
    title: ReactNode;
    className?: HTMLDivElement["className"];
}
export type PillVariant = PillProps["variant"];

const Pill = ({variant, size, title, className}: PillProps) => {
    return <div className={twMerge(pillVariants({variant, size, className}))}>{title}</div>
}

export default Pill;