import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import Button from "../../../primitives/buttons/Button.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import TextInput from "../../../primitives/form/TextInput.tsx";
import TextAreaInput from "../../../primitives/form/TextAreaInput.tsx";
import ExperimentData from "./ExperimentData.tsx";
import FileStatus from "../../../../types/files/FileStatus.ts";
import IExperiment from "../../../../types/experiments/Experiment.ts";

const schema = z.object({
    name: z.string(),
    start: z.date().optional(),
    end: z.date().optional(),
    note: z.string().optional()
})

type ExperimentFormValues = z.infer<typeof schema>;

interface ExperimentFormProps {
    experiment: IExperiment
    fileStatus: FileStatus | null
    onSubmit: (data: IExperiment) => void
    onStart: () => void
    onEnd: () => void
}

const ExperimentForm = ({experiment, fileStatus, onSubmit, onStart, onEnd}: ExperimentFormProps) => {
    const methods = useForm<ExperimentFormValues>({
        resolver: zodResolver(schema),
        values: experiment
    })
    const handleSubmit: SubmitHandler<ExperimentFormValues> = (data) => {
        onSubmit({...experiment, ...data});
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)}>
                <div className="flex flex-col gap-2 relative">
                    <TextInput<ExperimentFormValues> fieldName="name" label="Name"/>
                    <div className="flex flex-row gap-2">
                        <TextInput<ExperimentFormValues> fieldName="start" label="Start Time" readOnly/>
                        <TextInput<ExperimentFormValues> fieldName="end" label="End Time" readOnly/>
                    </div>
                    <TextAreaInput<ExperimentFormValues> fieldName="note" rows={4} label="Note"/>
                    <ExperimentData fileStatus={fileStatus} />
                    {methods.formState.isDirty && <Button type="submit" className="w-full" color="secondary">Save</Button>}
                    {(experiment.state === "prepared" || experiment.state === "active") && <div className="flex flex-row gap-2">
                        <Button type="submit" className="w-full" color="success" onClick={onStart}>Start</Button>
                        <Button type="submit" className="w-full" color="error" onClick={onEnd}>End</Button>
                    </div>}
                </div>
            </form>
        </FormProvider>
    )
}

export default ExperimentForm;