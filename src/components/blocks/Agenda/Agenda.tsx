import AgendaHour from "./AgendaHour.tsx";
import useTime from "../../../hooks/useTime.ts";
import AgendaEvent from "./AgendaEvent.tsx";
import CurrentHour from "./CurrentHour.tsx";
import useAgendaHours from "../../../hooks/useAgendaHours.ts";
import {useEffect, useRef} from "react";
import useReservations from "../../../hooks/useReservations.tsx";

const precomputeHours = 12;
const hourHeight = 100; // Hour size in pixels

export const getPosition = (agendaFrom: Date, time: Date) => {
    const start = new Date(agendaFrom);
    start.setMinutes(0)
    start.setSeconds(0)
    start.setMilliseconds(0)

    const to = new Date(time);
    to.setMinutes(0)
    to.setSeconds(0)
    to.setMilliseconds(0)

    const hours = Math.abs(to.getTime() - start.getTime()) / 36e5 - 1;
    return hours * hourHeight + ((time.getMinutes() / 60) * hourHeight) + 24;    // 24 is the padding of the agenda
};

const Agenda = () => {
    const reservations = useReservations();

    const time = useTime();
    const hours = useAgendaHours(time, precomputeHours);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const agendaFrom = hours[0];

    useEffect(() => {
        if (scrollContainerRef.current) {
            const currentHourPosition = getPosition(agendaFrom, time);
            scrollContainerRef.current.scrollTo({top: currentHourPosition - 400, behavior: "instant"});
        }
    }, [scrollContainerRef.current]);

    return (
        <div className="rounded-lg border border-gray-300 p-6 h-full overflow-y-scroll relative" ref={scrollContainerRef}>
                <CurrentHour agendaFrom={agendaFrom} time={time}/>
                {hours.map((hour, idx) => <AgendaHour currentTime={time} time={hour} height={hourHeight} key={idx}/>)}
                {reservations.map((event, idx) => <AgendaEvent event={event} agendaFrom={agendaFrom} key={idx}/>)}
        </div>
    )
}

export default Agenda;