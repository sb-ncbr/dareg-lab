import SideMenu from "./SideMenu/SideMenu.tsx";
import {Outlet} from "react-router-dom";
import DialogContextProvider from "../contexts/DialogContextProvider.tsx";

const Layout = () => {
    return (
        <DialogContextProvider>
            <div className="grid grid-cols-12 grid-rows-12 h-screen w-screen gap-6 relative p-6">
                <SideMenu/>
                <Outlet/>
            </div>
        </DialogContextProvider>
    );
}

export default Layout;