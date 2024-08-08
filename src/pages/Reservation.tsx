import Section from "../components/layout/Section/Section.tsx";
import ReservationInfo from "../components/blocks/Reservation/ReservationInfo.tsx";
import Experiments from "../components/blocks/Reservation/Experiments/Experiments.tsx";
import { useParams} from "react-router-dom";
import {events} from "../components/blocks/Agenda/Agenda.tsx";
import Button from "../components/primitives/buttons/Button.tsx";
import {useSetDialog} from "../contexts/DialogContextProvider.tsx";
import ConfirmEndReservationDialog from "../components/dialog/ConfirmEndExperimentDialog.tsx";

const ReservationPage = () => {
    const {reservationId} = useParams();
    const setDialog = useSetDialog();
    const reservation = events[parseInt(reservationId!)];

    return (
        <Section title="Reservation">
            <div className="flex flex-col gap-4">
                <ReservationInfo reservation={reservation} />
                <Experiments />
                <Button onClick={() => setDialog(<ConfirmEndReservationDialog reservation={reservation} />)}>End Reservation</Button>
            </div>
        </Section>
    )
}

export default ReservationPage;