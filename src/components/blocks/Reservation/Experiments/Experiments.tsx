import Experiment from "./Experiment.tsx";
import H3 from "../../../primitives/headings/H3.tsx";
import Button from "../../../primitives/buttons/Button.tsx";
import ExperimentForm from "./ExperimentForm.tsx";

const Experiments = () => {
    return (
        <div>
            <H3>Experiments</H3>
            <div className="flex flex-row">
                <div className="rounded-l-lg border border-r-0 border-gray-300 p-6 flex flex-col gap-2">
                    <Experiment state="done"/>
                    <Experiment state="failed"/>
                    <Experiment state="active"/>
                    <Experiment state="prepared"/>
                    <div className="mt-auto">
                        <Button variant="primary" className="w-full">
                            Add experiment
                        </Button>
                    </div>
                </div>
                <div className="rounded-r-lg border border-gray-300 p-6 flex-1">
                    <ExperimentForm />
                </div>
            </div>
        </div>
    )
}

export default Experiments;