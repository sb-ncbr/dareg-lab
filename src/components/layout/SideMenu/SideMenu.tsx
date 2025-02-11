import SideMenuSection from "./SideMenuSection.tsx";
import CurrentTime from "./CurrentTime.tsx";
import Ceitec from "../../../ceitec.svg";
import {useApiV1InstrumentMetadataRetrieve} from "../../../api.ts";
import {useSetDialog} from "../../../contexts/DialogContextProvider.tsx";
import {Button} from "@headlessui/react";
import InfoDialog from "../../dialog/InfoDialog.tsx";
import {InformationCircleIcon} from "@heroicons/react/24/outline";

const SideMenu = () => {
    const {data} = useApiV1InstrumentMetadataRetrieve();
    const instrument = data?.data;

    const setDialog = useSetDialog();

    return (
        <div className="bg-cyan-500 text-white p-6 col-span-4 md:col-span-3 row-span-12 flex flex-col justify-between">
            <div className="flex flex-col gap-4">
                <a href="/"><img src="/ceitec-bic.png" alt="Ceitec - Bic"/></a>
                <div className="flex flex-row items-center gap-2 justify-between">
                    <a href="/"><h1
                        className="subpixel-antialiased text-2xl font-bold leading-7 sm:truncate sm:text-2xl sm:tracking-tight">DAREG
                        Lab Client</h1></a>
                    <Button onClick={() => setDialog(<InfoDialog/>)}><InformationCircleIcon className="w-6 h-6" strokeWidth="2" /></Button>
                </div>
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