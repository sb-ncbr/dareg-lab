import {getPosition} from "./Agenda.tsx";
import {HOUR_WIDTH} from "./AgendaHour.tsx";
import {twMerge} from "tailwind-merge";
import {useSetDialog} from "../../../contexts/DialogContextProvider.tsx";
import ConfirmIdentityDialog from "../../dialog/ConfirmIdentityDialog.tsx";
import {Reservation} from "../../../api.ts";
import User from "../User/User.tsx";
import TimeSpan from "../TimeSpan/TimeSpan.tsx";
import {cva} from "class-variance-authority";

export interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
    user: string;
}

const agendaEventVariants = cva([
    "rounded-lg", "text-white", "p-6", "cursor-pointer", "bg-cyan-500"
], {
    variants: {
        isNow: {
            true: "bg-cyan-800",
            false: null
        },
        isPast: {
            true: "bg-gray-400",
            false: null
        }
    }
})

const AgendaEvent = ({ event, agendaFrom }: { event: Reservation, agendaFrom: Date }) => {
    const eventStart = new Date(event.from_date);
    const eventEnd = new Date(event.to_date);
    const start = getPosition(agendaFrom, eventStart);
    const end = getPosition(agendaFrom, eventEnd);
    const isNow = new Date() >= eventStart && new Date() <= eventEnd;
    const isPast = new Date() > eventEnd;

    const setDialog = useSetDialog();

    return (
        <div
            style={{
                position: "absolute",
                top: start,
                height: end - start,
                width: `calc(100% - ${HOUR_WIDTH}px - 3rem)`,
                marginLeft: HOUR_WIDTH,
            }}
            className={twMerge(agendaEventVariants({isNow, isPast }))}
            onClick={()=> setDialog(<ConfirmIdentityDialog reservation={event}/>)}
        >
            <h3 className="subpixel-antialiased text-lg font-bold leading-7 sm:truncate sm:text-xl">{event.name}</h3>
            <User name={event.user}/>
            <TimeSpan start={eventStart} end={eventEnd} />
        </div>
    );
}

export default AgendaEvent;