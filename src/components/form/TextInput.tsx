import {Field, Input} from "@headlessui/react";
import {twMerge} from "tailwind-merge";

const TextInput = () => {
    return (
        <div className="w-full max-w-md">
            <Field>
                <Input
                    className={twMerge(
                        'block w-full rounded-lg border-none bg-black/5 py-1.5 px-3 text-sm/6 text-black',
                        'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-black/25'
                    )}
                    placeholder="Identity Code"
                />
            </Field>
        </div>
    )
}

export default TextInput;