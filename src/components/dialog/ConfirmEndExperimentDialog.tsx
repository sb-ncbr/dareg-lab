import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import {useNavigate} from "react-router-dom";
import BaseDialog from "./BaseDialog.tsx";
import {
    DatasetResponse, Status464Enum, Reservation,
    useApiV1DatasetsPartialUpdate,
} from "../../api.ts";
import Alert from "../primitives/alert/Alert.tsx";
import User from "../blocks/User/User.tsx";
import TimeSpan from "../blocks/TimeSpan/TimeSpan.tsx";

const ConfirmEndExperimentDialog = ({dataset, reservation}: { dataset: DatasetResponse, reservation: Reservation }) => {
    const setDialog = useSetDialog();
    const navigate = useNavigate();

    const {
        mutate: partialUpdateDataset,
        isPending: isPartialUpdateDatasetPending,
    } = useApiV1DatasetsPartialUpdate({
        mutation: {
            onSuccess: () => {
                setDialog(null);
                navigate("/agenda");
            }
        }
    })

    return (
        <BaseDialog
            title={`End ${dataset.name}?`}
            content={
                <div>
                    <TimeSpan start={reservation.from_date} end={reservation.to_date} showDate/>
                    <User name={reservation.user}/>
                    <Alert severity="info" className="mt-4">
                        Are you sure you want to end the reservation? The reservation will not be accessible again.
                    </Alert>
                </div>}
            buttons={
                <Button type="button" onClick={() => partialUpdateDataset({id: dataset.id, data: {status: Status464Enum.finished}})} loading={isPartialUpdateDatasetPending}>
                    Confirm
                </Button>
            }/>
    )
}

export default ConfirmEndExperimentDialog;