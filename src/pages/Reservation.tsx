import Section from "../components/layout/Section/Section.tsx";
import Experiments from "../components/blocks/Reservation/Experiments/Experiments.tsx";
import { useParams} from "react-router-dom";
import Button from "../components/primitives/buttons/Button.tsx";
import {
    useApiV1DatasetsGetByReservationIdRetrieve,
    useApiV1ReservationRetrieve2
} from "../api.ts";
import {useSetDialog} from "../contexts/DialogContextProvider.tsx";
import ConfirmEndExperimentDialog from "../components/dialog/ConfirmEndExperimentDialog.tsx";
import ReservationInfo from "../components/blocks/Reservation/ReservationInfo.tsx";
import Skeleton from "../components/primitives/skeleton/Skeleton.tsx";
import ExperimentsContainer from "../components/blocks/Reservation/Experiments/ExperimentsContainer.tsx";

const useReservationData = (reservationId: string | undefined) => {

    const {data: datasetResponse} = useApiV1DatasetsGetByReservationIdRetrieve(reservationId as string)
    const dataset = datasetResponse?.data;
    const {data: reservationResponse} = useApiV1ReservationRetrieve2(reservationId as string);
    const reservation = reservationResponse?.data;

    const loading = !dataset || !reservation;
    return {dataset, reservation, loading};
};

const ReservationPage = () => {
    const {reservationId} = useParams();
    const setDialog = useSetDialog();
    const {dataset, reservation, loading} = useReservationData(reservationId);

    return (
        <Section title={loading ? undefined : dataset?.name}>
            <div className="flex flex-col gap-4 flex-1">
                {loading ? <Skeleton className="h-[98px]"/> : <ReservationInfo reservation={reservation!}/>}
                {loading ? <ExperimentsContainer><Skeleton className="h-full w-full"/></ExperimentsContainer> :
                    <Experiments dataset={dataset!}/>}
                <Button
                    color="primary"
                    onClick={() => dataset && reservation && setDialog(<ConfirmEndExperimentDialog dataset={dataset} reservation={reservation} />)}
                    className="mt-auto"
                    disabled={!dataset || !reservation}
                >
                    End Reservation
                </Button>
            </div>
        </Section>
    )
}

export default ReservationPage;