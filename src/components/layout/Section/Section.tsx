import {Fragment, PropsWithChildren} from "react";
import H2 from "../../primitives/headings/H2.tsx";

const Section = ({ children, title }: PropsWithChildren<{title: string}>) => {
    return (
        <Fragment>
            <div className="col-span-8 md:col-span-9 row-span-1 flex items-center">
                <H2>{title}</H2>
            </div>
            <div className="col-span-8 md:col-span-9 row-span-11 relative">
                {children}
            </div>
        </Fragment>
    );
}

export default Section;