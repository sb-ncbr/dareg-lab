import Section from "../components/layout/Section/Section.tsx";
import Experiments from "../components/blocks/Reservation/Experiments/Experiments.tsx";
import { useParams} from "react-router-dom";
import Button from "../components/primitives/buttons/Button.tsx";
import {useApiV1DatasetsRetrieve} from "../api.ts";
import {useSetDialog} from "../contexts/DialogContextProvider.tsx";
import ConfirmEndExperimentDialog from "../components/dialog/ConfirmEndExperimentDialog.tsx";

const ReservationPage = () => {
    const {reservationId} = useParams();
    const setDialog = useSetDialog();
    const {data} = useApiV1DatasetsRetrieve(reservationId as string)
    const dataset = data?.data;

    return (
        <Section title={dataset?.name ?? ""}>
            {dataset && <div className="flex flex-col gap-4 flex-1">
                {/*<ReservationInfo reservation={reservation} />*/}
                <Experiments dataset={dataset} />
                <Button
                    color="primary"
                    onClick={() => setDialog(<ConfirmEndExperimentDialog dataset={dataset} />)}
                    className="mt-auto"
                >
                    End Reservation
                </Button>
            </div>}
        </Section>
    )
}

export default ReservationPage;