import {Outlet} from "react-router-dom";
import DialogContextProvider from "../../contexts/DialogContextProvider.tsx";
import EmptySideMenu from "./SideMenu/EmptySideMenu.tsx";

const EmptyLayout = () => {
    return (
        <DialogContextProvider>
            <div className="grid grid-cols-12 h-screen w-screen relative">
                <EmptySideMenu/>
                <Outlet/>
            </div>
        </DialogContextProvider>
    );
}

export default EmptyLayout;