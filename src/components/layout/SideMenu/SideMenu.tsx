import SideMenuSection from "./SideMenuSection.tsx";
import CurrentTime from "./CurrentTime.tsx";
import Ceitec from "../../../ceitec.svg";
import {useApiV1InstrumentMetadataRetrieve} from "../../../api.ts";
import {invoke} from "@tauri-apps/api/tauri";

const SideMenu = () => {
    const {data} = useApiV1InstrumentMetadataRetrieve();
    const instrument = data?.data;
    return (
        <div className="bg-cyan-500 text-white p-6 col-span-4 md:col-span-3 row-span-12 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <a href="/" onClick={async () => {
                    await invoke("upload_file", {one_data_directory_id: "", directory: "/Users/davidkonecny/Documents/school/diplomova-prace/datareg/src-tauri/data"});
                }}><img src="/ceitec-bic.png" alt="Ceitec - Bic"/></a>
                <a href="/"><h1
                    className="subpixel-antialiased text-2xl font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">DAREG
                    Lab Client</h1></a>
                {instrument ? <SideMenuSection title="Facility" items={[
                    {title: "Name", item: instrument.facility?.name},
                    {
                        title: "Information for users",
                        item: <a
                            href={instrument.facility?.web}>{instrument.facility?.web}</a>
                    },
                    {
                        title: "Contact",
                        item: <a href={`mailto:${instrument.facility?.email}`}>{instrument.facility?.email}</a>
                    },
                ]}/> : <div className="">Placeholder</div>}
                {instrument ? <SideMenuSection title="Device" items={[
                    {title: "Device name", item: instrument.name},
                    {title: "Method", item: instrument.method},
                    {
                        title: "Support",
                        item: <a href={instrument.support}>{instrument.support}</a>
                    },
                    {title: "Contact", item: instrument.contact},
                ]}/> : <div className="">Placeholder</div>}
            </div>
            <div className="w-full flex flex-col items-center">
                <CurrentTime/>
                <img src={Ceitec} alt="Ceitec" className="mt-2 h-6"/>
            </div>
        </div>
    );
}

export default SideMenu;