import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import Button from "../primitives/buttons/Button.tsx";
import TextInput from "../primitives/form/TextInput.tsx";
import {useNavigate} from "react-router-dom";
import {Event} from "../blocks/Agenda/AgendaEvent.tsx";


export default function Example({reservation}: { reservation: Event }) {
    const setDialog = useSetDialog();
    const navigate = useNavigate();

    const onConfirm = () => {
        setDialog(null);
        navigate(`/reservation/${reservation.id}`, );
    }

    return (
        <Dialog open={true} onClose={() => setDialog(null)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            Confirm Registration
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <Button onClick={() => onConfirm()}>
                                Confirm
                            </Button>
                            <TextInput />
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}