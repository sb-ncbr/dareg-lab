import Layout from "./components/layout/Layout.tsx";
import AgendaPage from "./pages/Agenda.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ReservationPage from "./pages/Reservation.tsx";

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

function App() {
  return (
      <RouterProvider router={router} />
  );
}

export default App;
