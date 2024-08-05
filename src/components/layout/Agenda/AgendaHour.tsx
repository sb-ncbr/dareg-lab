import {formatTime} from "../../utils/format.ts";

export const HOUR_WIDTH = 70;

const AgendaHour = ({currentTime, time, height}: { time: Date, currentTime: Date, height: number }) => {
    const isNextDay = currentTime.getMonth() === time.getMonth()
        ? currentTime.getDate() < time.getDate()
        : currentTime.getMonth() < time.getMonth();
    const isPrevDay = currentTime.getMonth() === time.getMonth()
        ? currentTime.getDate() > time.getDate()
        : currentTime.getMonth() > time.getMonth();

    return (
        <div className="w-full min-w-52" style={{height}}>
            <div className="w-full flex flex-row">
                <div className="flex flex-col">
                    <span className="text-lg" style={{width: HOUR_WIDTH}}>{formatTime(time, {showMinutes: false})}</span>
                    {isNextDay && <span className="text-xs text-cyan-500">+1 day</span>}
                    {isPrevDay && <span className="text-xs text-cyan-500">-1 day</span>}
                </div>
                <div className="h-[1px] bg-gray-300 flex-1"></div>
            </div>
        </div>
    );
}

export default AgendaHour;