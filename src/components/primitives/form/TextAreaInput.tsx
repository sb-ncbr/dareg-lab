import {Field, Label, Textarea, TextareaProps} from "@headlessui/react";
import {Path, useController} from "react-hook-form";
import {twMerge} from "tailwind-merge";

export interface TextAreaInputProps<TValues> extends TextareaProps {
    label?: string;
    className?: string;
    fieldName: Path<TValues>
}

const TextAreaInput = <TValues extends object,>({className, fieldName, label, ...props}: TextAreaInputProps<TValues>) => {
    const {field} = useController<TValues>({name: fieldName})
    return (
        <div className="w-full">
            <Field>
                {label && <Label className="text-gray-800 text-lg">{label}</Label>}
                <Textarea
                    className={twMerge(
                        'block w-full rounded-lg border border-gray-300 py-1.5 px-3 text-sm/6 text-black',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25',
                        className
                    )}
                    {...props}
                    {...field}
                />
            </Field>
        </div>
    )
}

export default TextAreaInput;