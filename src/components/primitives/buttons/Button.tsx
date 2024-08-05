import { Button as HeadlessButton, ButtonProps as HeadlessButtonProps } from '@headlessui/react'
import {ReactNode} from "react";

interface ButtonProps extends HeadlessButtonProps {
    children: ReactNode;
}

const Button = ({children, ...props}: ButtonProps) => (
    <HeadlessButton className="rounded-lg bg-cyan-500 text-white px-2 py-1 uppercase" {...props}>
        {children}
    </HeadlessButton>
);

export default Button;