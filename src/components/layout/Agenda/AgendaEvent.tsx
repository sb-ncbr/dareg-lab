import {getPosition} from "./Agenda.tsx";
import {HOUR_WIDTH} from "./AgendaHour.tsx";
import {formatTime} from "../../utils/format.ts";
import {twMerge} from "tailwind-merge";
import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import ConfirmIdentityDialog from "../../dialog/ConfirmIdentityDialog.tsx";

export interface Event {
    id: string;
    title: string;
    start: Date;
    end: Date;
}

const AgendaEvent = ({ event, agendaFrom }: { event: Event, agendaFrom: Date }) => {
    const start = getPosition(agendaFrom, event.start);
    const end = getPosition(agendaFrom, event.end);
    const isNow = new Date() >= event.start && new Date() <= event.end;

    const setDialog = useSetDialog();

    return (
        <div
            style={{
                position: "absolute",
                top: start,
                height: end - start,
                width: `calc(100% - ${HOUR_WIDTH}px)`,
                marginLeft: HOUR_WIDTH,
            }}
            className={twMerge("rounded-lg text-white p-6 cursor-pointer", isNow ? "bg-cyan-800" : "bg-cyan-500")}
            onClick={()=> setDialog(<ConfirmIdentityDialog reservation={event}/>)}
        >
            <h3 className="subpixel-antialiased text-lg font-bold leading-7 sm:truncate sm:text-xl sm:tracking-tight">{event.title}</h3>
            <div className="text-sm font-light">
                {formatTime(event.start, {showMinutes: true})} - {formatTime(event.end, {showMinutes: true})}
            </div>
        </div>
    );
}

export default AgendaEvent;