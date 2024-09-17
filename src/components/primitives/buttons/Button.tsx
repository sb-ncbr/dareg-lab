import {Button as HeadlessButton, ButtonProps as HeadlessButtonProps} from '@headlessui/react'
import {ReactNode} from "react";
import {twMerge} from "tailwind-merge";
import {cva, VariantProps} from "class-variance-authority";

const buttonVariants = cva(
    ["rounded-lg", "px-2", "py-1", "uppercase", "disabled:cursor-not-allowed"],
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
            }
        },
        defaultVariants: {
            size: "medium",
            color: "primary",
        }
    });

interface ButtonProps extends Omit<HeadlessButtonProps, "color">, VariantProps<typeof buttonVariants> {
    children: ReactNode;
}

const Button = ({children, className, size, color, ...props}: ButtonProps) => (
    <HeadlessButton
        className={twMerge(buttonVariants({className, size, color}))}
        {...props}
    >
        {children}
    </HeadlessButton>
);

export default Button;