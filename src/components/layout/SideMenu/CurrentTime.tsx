import {Fragment} from "react";
import useTime from "../../../hooks/useTime.ts";

const CurrentTime = () => {
    const time = useTime();

    return <Fragment>
        <span className="font-bold text-4xl">{time.getHours()}:{time.getMinutes()}</span>
        <span className="font-bold text-lg">{time.getDay()}. {time.getMonth()}. {time.getFullYear()}</span>
    </Fragment>
}

export default CurrentTime;