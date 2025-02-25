import {cva, VariantProps} from "class-variance-authority";
import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";
import {ExclamationCircleIcon, ExclamationTriangleIcon, InformationCircleIcon} from "@heroicons/react/24/outline";

const alertVariants = cva([
    "rounded-md", "p-4", "border", "border-2", "flex", "flex-row", "items-center", "gap-4"
], {
    variants: {
        severity: {
            info: ["bg-blue-50", "text-black", "border-blue-400"],
            warning: ["bg-orange-50", "text-black", "border-orange-400"],
            error: ["bg-red-50", "text-black", "border-red-400"]
        }
    },
    defaultVariants: {
        severity: "info"
    }
})

interface AlertProps extends VariantProps<typeof alertVariants>, PropsWithChildren {
    className?: HTMLDivElement["className"]
}

const resolveIcon = (severity: VariantProps<typeof alertVariants>["severity"]) => {
    switch (severity) {
        case "warning":
            return <ExclamationTriangleIcon className="h-8 text-orange-400" strokeWidth="2"/>;
        case "info":
            return <InformationCircleIcon className="h-8 text-blue-400" strokeWidth="2"/>;
        case "error":
            return <ExclamationCircleIcon className="h-8 text-red-400" strokeWidth="2"/>;
        default:
            return null;
    }
}

const Alert = ({severity, children, className}: AlertProps) => {
    return (
        <div
            className={twMerge(alertVariants({severity}), className)}
        >
            {resolveIcon(severity)}
            {children}
        </div>
    )
}

export default Alert;