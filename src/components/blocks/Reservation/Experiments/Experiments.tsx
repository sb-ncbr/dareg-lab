import Experiment from "./Experiment.tsx";
import H3 from "../../../primitives/headings/H3.tsx";
import Button from "../../../primitives/buttons/Button.tsx";
import ExperimentForm from "./ExperimentForm.tsx";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import {listen} from "@tauri-apps/api/event";
import FileStatus from "../../../../types/files/FileStatus.ts";
import IExperiment from "../../../../types/experiments/Experiment.ts";

const Experiments = () => {
    const [experiments, setExperiments] = useState<IExperiment[]>([{
        name: "Default Experiment",
        state: "prepared"
    }]);
    const [selectedExperimentIdx, setSelectedExperimentIdx] = useState<number | null>(0);
    const [fileStatus, setFileStatus] = useState<FileStatus | null>(null);

    const handleAddExperiment = () => {
        setExperiments([...experiments, {
            name: "",
            state: "new"
        }])
        if (experiments.length === 0) {
            setSelectedExperimentIdx(0);
        }
    }

    const handleDelete = (idx: number) => {
        setExperiments(experiments.filter((_, i) => i !== idx));
        if (idx === selectedExperimentIdx) {
            setSelectedExperimentIdx(null)
        }
    }

    const handleUpdate = (idx: number, experiment: IExperiment) => {
        if (experiment.state === "new") {
            experiment.state = "prepared";
        }

        setExperiments(experiments.map((e, i) => i === idx ? experiment : e));
    }

    const handleSelectExperiment = (idx: number) => {
        setSelectedExperimentIdx(idx);
    }

    const startExperiment = async (idx: number) => {
        await invoke("start_measurement");
        handleUpdate(idx, {...experiments[idx], state: "active", start: new Date()});
    }

    const endExperiment = (idx: number) => {
        handleUpdate(idx, {...experiments[idx], state: "done", end: new Date()});
    }


    useEffect(() => {
        const unlisten = listen<string>('event-name', (event) => {
            setFileStatus(event.payload as unknown as FileStatus)
        });

        return () => {
            unlisten.then(f => f());
        };

    }, []);

    return (
        <div>
            <H3>Experiments</H3>
            <div className="flex flex-row">
                <div className="rounded-l-lg border border-r-0 border-gray-300 p-6 flex flex-col gap-2">
                    {experiments.map((experiment, idx) => (
                        <Experiment
                            key={idx}
                            experiment={experiment}
                            onDelete={() => handleDelete(idx)}
                            onSelect={() => handleSelectExperiment(idx)}
                        />
                    ))}
                    <div className="mt-auto">
                        <Button color="secondary" className="w-full" onClick={handleAddExperiment}>
                            Add experiment
                        </Button>
                    </div>
                </div>
                <div className="rounded-r-lg border border-gray-300 p-6 flex-1">
                    {selectedExperimentIdx !== null && (
                        <ExperimentForm
                            experiment={experiments[selectedExperimentIdx]}
                            fileStatus={fileStatus}
                            onSubmit={(experiment) => handleUpdate(selectedExperimentIdx, experiment)}
                            onStart={() => startExperiment(selectedExperimentIdx)}
                            onEnd={() => endExperiment(selectedExperimentIdx)}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

export default Experiments;