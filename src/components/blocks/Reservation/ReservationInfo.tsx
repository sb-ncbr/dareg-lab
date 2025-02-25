import User from "../User/User.tsx";
import TimeSpan from "../TimeSpan/TimeSpan.tsx";
import {Reservation} from "../../../api.ts";

interface ReservationInfoProps {
    reservation: Reservation;
}

const ReservationInfo = ({reservation}: ReservationInfoProps) => {
    return (
        <div className="rounded-lg border border-gray-300 p-6">
            <TimeSpan start={reservation.from_date} end={reservation.to_date} showDate />
            <User name={reservation.user} />
        </div>
    )
}

export default ReservationInfo;