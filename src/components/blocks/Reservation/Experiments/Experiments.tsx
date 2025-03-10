import ExperimentItem from "./ExperimentItem.tsx";
import Button from "../../../primitives/buttons/Button.tsx";
import ExperimentForm from "./ExperimentForm.tsx";
import {useEffect, useState} from "react";
import {
    useApiV1ExperimentsCreate,
    Experiment,
    DatasetResponse, useApiV1InstrumentMetadataRetrieve, ExperimentStatusEnum, useApiV1ExperimentsPartialUpdate
} from "../../../../api.ts";
import {toast} from "react-toastify";
import ExperimentsContainer from "./ExperimentsContainer.tsx";

interface ExperimentsProps {
    dataset: DatasetResponse
}

const Experiments = ({dataset}: ExperimentsProps) => {
    const [experiments, setExperiments] = useState<Experiment[]>([...dataset.experiments]);
    const [selectedExperimentId, setSelectedExperimentId] = useState<string | null>(null);
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
                setSelectedExperimentId(data.data.id);
                toast.success("Experiment created successfully");
            },
            onError: (error, variables, context) => {
                toast.error("Failed to create experiment");
                console.log(error, variables, context);
            }
        }
    });

    const {
        mutate: partialUpdateExperiment,
    } = useApiV1ExperimentsPartialUpdate({
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
                status: ExperimentStatusEnum.new,
                note: "",
                start_time: null,
                end_time: null,
                dataset: dataset.id
            }
        })
    }

    const handleDelete = (experiment: Experiment) => {
        const {id} = experiment;
        if (selectedExperimentId === id) {
            setSelectedExperimentId(experiments.length > 1 ? experiments.find(experiment => experiment.id != id)!.id : null);
        }
        setDeletingExperimentId(id)
        partialUpdateExperiment({
            id, data: {
                status: ExperimentStatusEnum.discarded
            }
        })
    }

    const handleSelectExperiment = (experiment: Experiment) => {
        if (experiment.status === ExperimentStatusEnum.discarded) {
            toast.warning("This experiment has been discarded and cannot be edited");
            return;
        }
        setSelectedExperimentId(experiment.id);
    }

    useEffect(() => {
        if (experiments.length > 0 && selectedExperimentId === null) {
            setSelectedExperimentId(experiments[0].id);
        }
    }, []);

    return (
        <ExperimentsContainer>
            <div className="rounded-l-lg border border-r-0 border-gray-300 p-4 flex flex-col gap-2 w-80">
                <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
                    {experiments.map((experiment, idx) => (
                        <ExperimentItem
                            key={idx}
                            experiment={experiment}
                            onDelete={() => handleDelete(experiment)}
                            onSelect={() => handleSelectExperiment(experiment)}
                            selected={selectedExperimentId === experiment.id}
                            deleting={deletingExperimentId === experiment.id}
                        />
                    ))}
                </div>
                <Button
                    color="secondary"
                    className="w-full"
                    onClick={handleAddExperiment}
                    loading={isCreateExperimentPending}
                >
                    Add experiment
                </Button>
            </div>
            <div className="rounded-r-lg border border-gray-300 p-4 flex-1">
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
        </ExperimentsContainer>
    )
}

export default Experiments;