import {ClockIcon} from "@heroicons/react/24/outline";
import {formatTime} from "../../../utils/format.ts";
import {Fragment} from "react";

interface TimeSpanProps {
    start: Date | string;
    end: Date | string;
    showDate?: boolean;
}

const TimeSpan = ({start, end, showDate}: TimeSpanProps) => {
    if (typeof start === "string") {
        start = new Date(start);
    }
    if (typeof end === "string") {
        end = new Date(end);
    }
    return (<div className="flex flex-row items-center gap-2">
        <ClockIcon className="h-4 w-4"/>
        <span className="font-medium">{showDate && <Fragment>{start.getDate()}.{start.getDate()}.</Fragment>} {formatTime(start, {showMinutes: true})} - {formatTime(end, {showMinutes: true})}</span>
    </div>)
}

export default TimeSpan;