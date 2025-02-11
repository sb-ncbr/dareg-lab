import {Field, Input, InputProps, Label} from "@headlessui/react";
import {twMerge} from "tailwind-merge";

export interface DateDisplayInputProps extends InputProps {
    label?: string;
    className?: string;
    date: Date | null;
}

const TextInput = ({className, label, readOnly, ...props}: DateDisplayInputProps) => {
    return (
        <div className="w-full block">
            <Field>
                {label && <Label className="text-gray-800 text-lg">{label}</Label>}
                <Input
                    className={twMerge(
                        'block w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm/6 text-black',
                        readOnly ? "bg-slate-100" : 'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
                        className
                    )}
                    readOnly={readOnly}
                    {...props}
                    value={props.date?.toLocaleString() ?? ""}
                />
            </Field>
        </div>
    )
}

export default TextInput;