import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import Button from "../../../primitives/buttons/Button.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import TextInput from "../../../primitives/form/TextInput.tsx";
import TextAreaInput from "../../../primitives/form/TextAreaInput.tsx";
import ExperimentData from "./ExperimentData.tsx";

const schema = z.object({
    name: z.string(),
    start: z.date(),
    end: z.date(),
    note: z.string().optional()
})

type ExperimentFormValues = z.infer<typeof schema>;

const ExperimentForm = () => {
    const methods = useForm<ExperimentFormValues>({
        resolver: zodResolver(schema),
    })
    const onSubmit: SubmitHandler<ExperimentFormValues> = (data) => console.log(data)

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                    <TextInput<ExperimentFormValues> fieldName="name" label="Name"/>
                    <div className="flex flex-row gap-2">
                        <TextInput<ExperimentFormValues> fieldName="start" label="Start Time"/>
                        <TextInput<ExperimentFormValues> fieldName="end" label="End Time"/>
                    </div>
                    <TextAreaInput<ExperimentFormValues> fieldName="note" rows={4} label="Note"/>
                    <ExperimentData />
                    <Button type="submit" className="w-full">End Experiment</Button>
                </div>
            </form>
        </FormProvider>
    )
}

export default ExperimentForm;