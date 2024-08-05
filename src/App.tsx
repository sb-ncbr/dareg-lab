import React, { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
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
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
      <RouterProvider router={router} />
  );
}

export default App;
