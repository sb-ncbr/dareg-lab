import ExperimentState from "./ExperimentState.ts";

export default interface IExperiment {
    name: string;
    start?: Date;
    end?: Date;
    note?: string
    state: ExperimentState;
}