import {Fragment, PropsWithChildren} from "react";

const Section = ({ children, title }: PropsWithChildren<{title: string}>) => {
    return (
        <Fragment>
            <div className="col-span-8 md:col-span-9 row-span-1 flex items-center">
                <h2 className="font-extrabold text-4xl mb-4 leading-7">{title}</h2>
            </div>
            <div className="col-span-8 md:col-span-9 row-span-11 relative">
                {children}
            </div>
        </Fragment>
    );
}

export default Section;