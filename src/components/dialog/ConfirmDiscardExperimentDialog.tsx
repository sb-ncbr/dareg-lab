import Button from "../primitives/buttons/Button.tsx";
import BaseDialog from "./BaseDialog.tsx";
import {Experiment} from "../../api.ts";
import Alert from "../primitives/alert/Alert.tsx";

interface ConfirmDeleteExperimentDialogProps {
    experiment: Experiment;
    onDiscard: () => void;
}

const ConfirmDiscardExperimentDialog = ({experiment, onDiscard}: ConfirmDeleteExperimentDialogProps) => {

    return (
        <BaseDialog
            title={`Discard ${experiment.name}?`}
            content={<Alert severity="warning">Are you sure you want to discard this experiment? This action cannot be undone.</Alert>}
            buttons={
                <Button type="button" onClick={onDiscard}>
                    Confirm
                </Button>
            }/>
    )
}

export default ConfirmDiscardExperimentDialog;