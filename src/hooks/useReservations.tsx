import {useApiV1ReservationRetrieve} from "../api.ts";
import {useEffect, useState} from "react";

const getPrevTime = () => {
    const from = new Date();
    from.setHours(from.getHours() - 12);
    return from;
}

const getNextTime = () => {
    const to = new Date();
    to.setHours(to.getHours() + 12);
    return to;
}

const REFETCH_INTERVAL = 1 * 1 * 60 * 1000;

const useReservations = () => {
    const [from, setFrom] = useState(getPrevTime());
    const [to, setTo] = useState(getNextTime());

    const {data} = useApiV1ReservationRetrieve({
        date_from: from.toISOString(),
        date_to: to.toISOString(),
    })

    useEffect(() => {
        const interval = setInterval(() => {
            setFrom(getPrevTime());
            setTo(getNextTime());
        }, REFETCH_INTERVAL);
        return () => clearInterval(interval);
    }, []);

    return data?.data || [];
}

export default useReservations;