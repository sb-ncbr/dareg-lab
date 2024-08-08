import {PropsWithChildren} from "react";

const H2 = ({children}: PropsWithChildren) => {
    return <h2 className="font-extrabold text-4xl mb-4 leading-7">{children}</h2>
}

export default H2;