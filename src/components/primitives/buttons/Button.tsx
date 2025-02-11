import {Button as HeadlessButton, ButtonProps as HeadlessButtonProps} from '@headlessui/react'
import {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {cva, VariantProps} from "class-variance-authority";
import CircularLoader from "../loaders/CircularLoader.tsx";

const buttonVariants = cva(
    ["rounded-lg", "px-2", "py-1", "uppercase", "disabled:cursor-not-allowed", "flex", "flex-row", "items-center justify-center"],
    {
        variants: {
            size: {
                small: [""],
                medium: [""],
                large: [""],
            },
            color: {
                primary: ["bg-cyan-500", "text-white"],
                secondary: ["bg-zinc-600", "text-white"],
                outlined: [""],
                error: ["bg-red-600", "text-white"],
                success: ["bg-green-600", "text-white"],
            },
            disabled: {
                true: ["bg-gray-500", "text-gray-200"],
            }
        },
        defaultVariants: {
            size: "medium",
            color: "primary",
        }
    });

interface ButtonProps extends Omit<HeadlessButtonProps, "color">, Omit<VariantProps<typeof buttonVariants>, "disabled"> {
    children: ReactNode;
    loading?: boolean;
}

const Button = ({children, className, size, color, loading, disabled, ...props}: ButtonProps) => (
    <HeadlessButton
        className={twMerge(buttonVariants({className, size, color, disabled: disabled || loading}))}
        disabled={loading || disabled}
        {...props}
    >
        {loading && <CircularLoader />}
        {children}
    </HeadlessButton>
);

export default Button;