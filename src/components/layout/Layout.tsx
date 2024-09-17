import SideMenu from "./SideMenu/SideMenu.tsx";
import {Navigate, Outlet, useLocation} from "react-router-dom";
import DialogContextProvider from "../../contexts/DialogContextProvider.tsx";

const Layout = () => {
    const location = useLocation();

    if (location.pathname == "/")
        return <Navigate to="/agenda" />

    return (
        <DialogContextProvider>
            <div className="grid grid-cols-12 h-screen w-screen relative">
                <SideMenu/>
                <Outlet/>
            </div>
        </DialogContextProvider>
    );
}

export default Layout;