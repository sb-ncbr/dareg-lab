import {useMemo} from "react";
import {getPosition} from "./Agenda.tsx";
import {formatTime} from "../../utils/format.ts";

interface CurrentHourProps {
    agendaFrom: Date;
    time: Date;
}

const CurrentHour = ({time, agendaFrom}: CurrentHourProps) => {
    const hourPosition = useMemo(() => {
        return getPosition(time, agendaFrom);
    }, [agendaFrom, time]);

    return (
        <div className="w-full flex flex-row items-center absolute z-10" style={{top: hourPosition}}>
            <span className="w-20 text-lg text-red-500">{formatTime(time, {showMinutes: true})}</span>
            <div className="h-[1px] bg-red-500 flex-1"></div>
        </div>
    )
}

export default CurrentHour;