import {PropsWithChildren} from "react";
import H2 from "../../primitives/headings/H2.tsx";
import Skeleton from "../../primitives/skeleton/Skeleton.tsx";

const Section = ({children, title}: PropsWithChildren<{ title?: string }>) => {
    return (
        <div className="col-span-8 md:col-span-9 flex flex-col p-4 gap-2 h-screen">
            {title ? <H2>{title}</H2> : <Skeleton className="h-7 mb-4"/>}
            {children}
        </div>
    );
}

export default Section;