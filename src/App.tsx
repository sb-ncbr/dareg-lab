import Layout from "./components/layout/Layout.tsx";
import AgendaPage from "./pages/Agenda.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ReservationPage from "./pages/Reservation.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ToastContainer } from 'react-toastify';
import ConfigContextProvider from "./contexts/ConfigContextProvider.tsx";
import {useEffect} from "react";
import {configDir} from "@tauri-apps/api/path";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "agenda",
                element: <AgendaPage />,
            },
            {
                path: "reservation/:reservationId",
                element: <ReservationPage />,
            },
        ],
    },
]);
const queryClient = new QueryClient()

const App = () => {

    useEffect(() => {
        configDir().then((dir) => {
            console.log(dir);
        })
    }, []);

    return (
        <ConfigContextProvider>
            <QueryClientProvider client={queryClient}>
                <ToastContainer />
                <RouterProvider router={router}/>
            </QueryClientProvider>
        </ConfigContextProvider>
    );
};

export default App;
