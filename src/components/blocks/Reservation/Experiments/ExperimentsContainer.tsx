import {ReactNode} from "react";
import H3 from "../../../primitives/headings/H3.tsx";

const ExperimentsContainer = ({children}: {children: ReactNode[] | ReactNode}) => {
    return <div className="flex flex-col flex-1 min-h-0">
        <H3>Experiments</H3>
        <div className="flex flex-row flex-1 overscroll-y-auto min-h-0">
            {children}
        </div>
    </div>
}

export default ExperimentsContainer;