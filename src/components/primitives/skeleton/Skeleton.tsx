import {cva, VariantProps} from "class-variance-authority";
import {twMerge} from "tailwind-merge";

const skeletonVariants = cva(
    ["bg-gray-200", "opacity-[.80]", "animate-pulse", "rounded-md"],
    {
        variants: {
            type: {
                "block": ["block"],
            }
        },
        defaultVariants: {
            type: "block",
        }
    });

interface SkeletonProps extends VariantProps<typeof skeletonVariants> {
    className: HTMLDivElement["className"]
}

const Skeleton = ({type, className}: SkeletonProps) => {
    return <div className={twMerge(skeletonVariants({type, className}))}></div>
}

export default Skeleton;