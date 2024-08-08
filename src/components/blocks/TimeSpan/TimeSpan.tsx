import {ClockIcon} from "@heroicons/react/24/outline";
import {formatTime} from "../../../utils/format.ts";

interface TimeSpanProps {
    start: Date;
    end: Date;
}

const TimeSpan = ({start, end}: TimeSpanProps) => {
    return (<div className="flex flex-row items-center gap-2">
        <ClockIcon className="h-6 w-6"/>
        <span className="font-bold">{start.getDate()}.{start.getDate()}. {formatTime(start, {showMinutes: true})} - {formatTime(end, {showMinutes: true})}</span>
    </div>)
}

export default TimeSpan;