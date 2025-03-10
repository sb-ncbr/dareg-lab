import {FormProvider, SubmitHandler, useForm} from "react-hook-form";
import Button from "../../../primitives/buttons/Button.tsx";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import TextInput from "../../../primitives/form/TextInput.tsx";
import TextAreaInput from "../../../primitives/form/TextAreaInput.tsx";
import ExperimentData from "./ExperimentData.tsx";
import {
    Experiment, ExperimentStatusEnum, Instrument,
    useApiV1ExperimentsPartialUpdate,
    useApiV1ExperimentsUpdate
} from "../../../../api.ts";
import {invoke} from "@tauri-apps/api/tauri";
import {toast} from "react-toastify";
import {open} from '@tauri-apps/api/dialog';
import {FolderOpenIcon} from "@heroicons/react/24/outline";
import DateDisplayInput from "../../../primitives/form/DateDisplayInput.tsx";


const schema = z.object({
    folder: z.string(),
    name: z.string(),
    note: z.string()
})

type ExperimentFormValues = z.infer<typeof schema>;

interface ExperimentFormProps {
    instrument: Instrument;
    experiment: Experiment;
    onUpdate: (data: Experiment) => void;
}

const ExperimentForm = ({instrument, experiment, onUpdate}: ExperimentFormProps) => {
    const methods = useForm<ExperimentFormValues>({
        resolver: zodResolver(schema),
        values: {
            name: experiment.name ?? "",
            folder: instrument.default_data_dir ?? "",
            note: experiment.note ?? ""
        }
    })

    const {
        mutate: updateExperiment,
        isPending: isUpdateExperimentPending,
        // error: updateExperimentError
    } = useApiV1ExperimentsUpdate({
        mutation: {
            onSuccess: (data) => {
                onUpdate(data.data);
                toast.success("Experiment updated successfully");
            }
        }
    })

    const {
        mutate: partialUpdateExperiment,
        isPending: isPartialUpdateExperimentPending,
        // error: partialUpdateExperimentError
    } = useApiV1ExperimentsPartialUpdate({
        mutation: {
            onSuccess: (data) => {
                onUpdate(data.data);
            }
        }
    })

    const startExperiment = async () => {
        await invoke("start_upload", {experimentId: experiment.id, directory: methods.getValues("folder")});
        partialUpdateExperiment({
            id: experiment.id,
            data: {
                status: "running",
                start_time: new Date().toISOString()
            }
        })
    }

    const endExperiment = async () => {
        await invoke("stop_upload");
        partialUpdateExperiment({
            id: experiment.id,
            data: {
                status: "synchronizing",
                end_time: new Date().toISOString()
            }
        })
    }

    const success = (experimentId: string) => {
        toast.success("Data uploaded successfully");
        partialUpdateExperiment({
            id: experimentId,
            data: {
                status: "success",
            }
        })
    }

    const pickFolder = async () => {
        const selectedFolder = await open({
            directory: true,
            multiple: false,
            defaultPath: instrument.default_data_dir
        });

        if (typeof selectedFolder !== "string") {
            return;
        }

        methods.setValue("folder", selectedFolder);
    }

    const handleSubmit: SubmitHandler<ExperimentFormValues> = (data) => {
        updateExperiment({
            id: experiment.id,
            data: {
                ...experiment,
                status: experiment.status === ExperimentStatusEnum.new ? ExperimentStatusEnum.prepared : experiment.status,
                name: data.name,
                note: data.note
            }
        });
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSubmit)} className="h-full flex flex-col gap-2 relative">
                <div className="flex flex-col flex-1 gap-2 overflow-y-auto min-h-0">
                    <TextInput<ExperimentFormValues> fieldName="name" label="Name"/>
                    <div className="flex flex-row gap-2 items-end">
                        <TextInput<ExperimentFormValues> fieldName="folder" label="Data Folder"/>
                        <Button type="button" onClick={pickFolder} className="h-[38px]"><FolderOpenIcon className="h-4 w-4" /></Button>
                    </div>
                    <div className="flex flex-row gap-2">
                        <DateDisplayInput date={experiment.start_time ? new Date(experiment.start_time) : null} label="Start Time" readOnly/>
                        <DateDisplayInput date={experiment.end_time ? new Date(experiment.end_time) : null} label="End Time" readOnly/>
                    </div>
                    <TextAreaInput<ExperimentFormValues> fieldName="note" rows={4} label="Note"/>
                </div>
                <ExperimentData onSuccess={success} onError={success}/>
                <div className="mt-auto gap-2 flex flex-col">
                    {methods.formState.isDirty && <Button type="submit" className="w-full" color="secondary"
                                                          loading={isUpdateExperimentPending}>Save</Button>}
                    {(experiment.status === "prepared" || experiment.status === "running") &&
                        <div className="flex flex-row gap-2">
                            <Button type="button" className="w-full" color="success" onClick={startExperiment}
                                    loading={isPartialUpdateExperimentPending}
                                    disabled={experiment.status !== ExperimentStatusEnum.prepared}>Start</Button>
                            <Button type="button" className="w-full" color="error" onClick={endExperiment}
                                    loading={isPartialUpdateExperimentPending}
                                    disabled={experiment.status !== ExperimentStatusEnum.running}>End</Button>
                        </div>}
                </div>
            </form>
        </FormProvider>
    )
}

export default ExperimentForm;