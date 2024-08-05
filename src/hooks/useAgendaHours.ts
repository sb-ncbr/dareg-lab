import {useMemo} from "react";

const useAgendaHours = (time: Date, precomputeHours: number) => {
    return useMemo<Date[]>(() => {
        const hours: Date[] = [];

        for (let i = precomputeHours; i > 1; i--) {
            const hour = time.getHours() - i;
            const date = new Date(time);
            date.setHours(hour);
            hours.push(date)
        }

        hours.push(new Date(time))

        for (let i = 1; i <= precomputeHours; i++) {
            const hour = time.getHours() + i;
            const date = new Date(time);
            date.setHours(hour);
            hours.push(date)
        }

        return hours;
    }, [time])
}

export default useAgendaHours;