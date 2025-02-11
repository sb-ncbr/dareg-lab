import ExperimentItem from "./ExperimentItem.tsx";
import H3 from "../../../primitives/headings/H3.tsx";
import Button from "../../../primitives/buttons/Button.tsx";
import ExperimentForm from "./ExperimentForm.tsx";
import {useEffect, useState} from "react";
import {
    StatusEnum,
    useApiV1ExperimentsCreate,
    Experiment,
    useApiV1ExperimentsDestroy,
    DatasetResponse, useApiV1InstrumentMetadataRetrieve
} from "../../../../api.ts";
import {toast} from "react-toastify";

interface ExperimentsProps {
    dataset: DatasetResponse
}

const Experiments = ({dataset}: ExperimentsProps) => {
    const [experiments, setExperiments] = useState<Experiment[]>(dataset.experiments);
    const [selectedExperimentId, setSelectedExperimentIdx] = useState<string | null>(null);
    const [deletingExperimentId, setDeletingExperimentId] = useState<string | null>(null);

    const {data} = useApiV1InstrumentMetadataRetrieve();
    const instrument = data?.data;

    const {
        mutate: createExperiment,
        isPending: isCreateExperimentPending,
    } = useApiV1ExperimentsCreate({
        mutation: {
            onSuccess: (data) => {
                setExperiments([...experiments, data.data]);
                if (experiments.length === 0) {
                    setSelectedExperimentIdx(data.data.id);
                }
                toast.success("Experiment created successfully");
            },
            onError: (error, variables, context) => {
                toast.error("Failed to create experiment");
                console.log(error, variables, context);
            }
        }
    });

    const {
        mutate: destroyExperiment,
    } = useApiV1ExperimentsDestroy({
        mutation: {
            onSuccess: () => {
                setExperiments(experiments.filter((experiment) => experiment.id !== deletingExperimentId));
                setDeletingExperimentId(null);
                toast.success("Experiment deleted successfully");
            },
            onError: (error, variables, context) => {
                setDeletingExperimentId(null);
                toast.error("Failed to delete experiment");
                console.log(error, variables, context);
            }
        }
    })

    const handleAddExperiment = async () => {
        createExperiment({
            data: {
                name: "",
                status: StatusEnum.new,
                note: "",
                start_time: null,
                end_time: null,
                dataset: dataset.id
            }
        })
    }

    const handleDelete = (id: string) => {
        if (selectedExperimentId === id) {
            setSelectedExperimentIdx(experiments.length > 1 ? experiments.find(experiment => experiment.id != id)!.id : null);
        }
        setDeletingExperimentId(id)
        destroyExperiment({ id })
    }

    const handleSelectExperiment = (idx: string) => {
        setSelectedExperimentIdx(idx);
    }

    useEffect(() => {
        if (experiments.length > 0 && selectedExperimentId === null) {
            setSelectedExperimentIdx(experiments[0].id);
        }
    }, []);

    return (
        <div className="flex flex-col flex-1">
            <H3>Experiments</H3>
            <div className="flex flex-row flex-1 overscroll-y-auto">
                <div className="rounded-l-lg border border-r-0 border-gray-300 p-6 flex flex-col gap-2 w-80">
                    {experiments.map((experiment, idx) => (
                        <ExperimentItem
                            key={idx}
                            experiment={experiment}
                            onDelete={() => handleDelete(experiment.id)}
                            onSelect={() => handleSelectExperiment(experiment.id)}
                            selected={selectedExperimentId === experiment.id}
                            deleting={deletingExperimentId === experiment.id}
                        />
                    ))}
                    <div className="mt-auto">
                        <Button color="secondary" className="w-full" onClick={handleAddExperiment} loading={isCreateExperimentPending}>
                            Add experiment
                        </Button>
                    </div>
                </div>
                <div className="rounded-r-lg border border-gray-300 p-6 flex-1">
                    {selectedExperimentId !== null && !!instrument && (
                        <ExperimentForm
                            experiment={experiments.find((experiment) => experiment.id === selectedExperimentId)!}
                            instrument={instrument}
                            onUpdate={(data) => {
                                setExperiments(experiments.map((experiment) => experiment.id === data.id ? data : experiment));
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Experiments;