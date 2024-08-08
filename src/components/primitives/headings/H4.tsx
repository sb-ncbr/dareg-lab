import {PropsWithChildren} from "react";

const H3 = ({children}: PropsWithChildren) => {
    return <h2 className="font-extrabold text-xl">{children}</h2>
}

export default H3;