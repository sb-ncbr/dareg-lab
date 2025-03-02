import {getPosition} from "./Agenda.tsx";
import {HOUR_WIDTH} from "./AgendaHour.tsx";
import {twMerge} from "tailwind-merge";
import {useSetDialog} from "../../../contexts/DialogContextProvider.tsx";
import ConfirmIdentityDialog from "../../dialog/ConfirmIdentityDialog.tsx";
import {Reservation, Status464Enum} from "../../../api.ts";
import User from "../User/User.tsx";
import TimeSpan from "../TimeSpan/TimeSpan.tsx";
import {cva} from "class-variance-authority";
import Pill from "../../primitives/Pills/Pill.tsx";

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

const resolveLabel = (status: string | null) => {
    switch (status) {
        case Status464Enum.finished:
            return "Saved Dataset";
        case Status464Enum.new:
            return "Open Dataset";
        case null:
            return "No Dataset"
    }
}

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
            <div className="flex flex-row items-center gap-2">
                <Pill title={resolveLabel(event.dataset_status)} variant="inverted" size="small"/>
                <h3 className="subpixel-antialiased text-lg font-bold leading-7 sm:truncate sm:text-xl">{event.name}</h3>
            </div>
            <User name={event.user}/>
            <TimeSpan start={eventStart} end={eventEnd} />
        </div>
    );
}

export default AgendaEvent;