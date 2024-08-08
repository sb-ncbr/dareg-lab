import User from "../User/User.tsx";
import TimeSpan from "../TimeSpan/TimeSpan.tsx";
import {Event} from "../Agenda/AgendaEvent.tsx";

interface ReservationInfoProps {
    reservation: Event;
}

const ReservationInfo = ({reservation}: ReservationInfoProps) => {
    return (
        <div className="rounded-lg border border-gray-300 p-6">
            <TimeSpan start={reservation.start} end={reservation.end} />
            <User name={reservation.user} />
        </div>
    )
}

export default ReservationInfo;