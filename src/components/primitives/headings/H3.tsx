import {PropsWithChildren} from "react";

const H3 = ({children}: PropsWithChildren) => {
    return <h2 className="font-extrabold text-2xl mb-4 leading-7">{children}</h2>
}

export default H3;