import SideMenuSection from "./SideMenuSection.tsx";
import CurrentTime from "./CurrentTime.tsx";
import Ceitec from "../../../ceitec.svg";

const SideMenu = () => {
    return (
        <div className="bg-cyan-500 text-white p-6 rounded-lg col-span-4 md:col-span-3 row-span-12 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <img src="/ceitec-bic.png" alt="Ceitec - Bic"/>
                <h1 className="subpixel-antialiased text-2xl font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">DAREG - Device App</h1>
                <SideMenuSection title="Facility" items={[
                    {title: "Name", item: "Core Facility Biomolecular Interactions and Crystallography"},
                    {
                        title: "Information for users",
                        item: <a
                            href="https://bic.ceitec.cz/information-for-users ">https://bic.ceitec.cz/information-for-users </a>
                    },
                    {title: "Contact", item: <a href="mailto:bic@ceitec.cz">bic@ceitec.cz</a>},
                ]}/>
                <SideMenuSection title="Facility" items={[
                    {title: "Device name", item: "ProteomeLab XL-1"},
                    {title: "Method", item: "Analytical ultracentrifugation"},
                    {
                        title: "Support",
                        item: <a
                            href="https://bic.ceitec.cz/files/292/346.pdf">https://bic.ceitec.cz/files/292/346.pdf</a>
                    },
                    {title: "Method", item: "Jan Komarek (+420 666 666 666)"},
                ]}/>
            </div>
            <div className="w-full flex flex-col items-center">
                <CurrentTime/>
                <img src={Ceitec} alt="Ceitec" className="mt-2 h-6"/>
            </div>
        </div>
    );
}

export default SideMenu;