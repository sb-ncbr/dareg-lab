import {useMemo} from "react";
import {getPosition} from "./Agenda.tsx";
import {formatTime} from "../../../utils/format.ts";
import {HOUR_WIDTH} from "./AgendaHour.tsx";

interface CurrentHourProps {
    agendaFrom: Date;
    time: Date;
}

const CurrentHour = ({time, agendaFrom}: CurrentHourProps) => {
    const hourPosition = useMemo(() => {
        return getPosition(time, agendaFrom);
    }, [agendaFrom, time]);

    return (
        <div className="flex flex-row items-center absolute z-10 inset-0 px-6" style={{top: hourPosition}}>
            <span style={{width: HOUR_WIDTH}}><span className="text-lg bg-red-500 text-white p-1 rounded">{formatTime(time, {showMinutes: true})}</span></span>
            <div className="h-[1px] bg-red-500 flex-1"></div>
        </div>
    )
}

export default CurrentHour;