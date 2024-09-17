import {Field, Input, InputProps, Label} from "@headlessui/react";
import {twMerge} from "tailwind-merge";
import {Path, useController} from "react-hook-form";

export interface TextInputProps<TValues> extends InputProps {
    label?: string;
    className?: string;
    fieldName: Path<TValues>
}

const TextInput = <TValues extends object,>({className, fieldName, label, readOnly, ...props}: TextInputProps<TValues>) => {
    const {field} = useController<TValues>({name: fieldName})

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
                    {...field}
                />
            </Field>
        </div>
    )
}

export default TextInput;