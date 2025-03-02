import {Fragment} from "react";
import useTime from "../../../hooks/useTime.ts";

const CurrentTime = () => {
    const time = useTime();

    return <Fragment>
        <span className="font-bold text-4xl">{time.getHours()}:{String(time.getMinutes()).padStart(2, "0")}</span>
        <span className="font-bold text-lg">{time.getDate()}. {time.getMonth() + 1}. {time.getFullYear()}</span>
    </Fragment>
}

export default CurrentTime;