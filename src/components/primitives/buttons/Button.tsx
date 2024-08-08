import { Button as HeadlessButton, ButtonProps as HeadlessButtonProps } from '@headlessui/react'
import {ReactNode} from "react";
import {twJoin} from "tailwind-merge";

interface ButtonProps extends HeadlessButtonProps {
    children: ReactNode;
    variant?: "primary" | "secondary" | "inverted" | "error";
    className?: string;
}

const Button = ({children, className, ...props}: ButtonProps) => (
    <HeadlessButton className={twJoin("rounded-lg bg-cyan-500 text-white px-2 py-1 uppercase", className)} {...props}>
        {children}
    </HeadlessButton>
);

export default Button;