import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import {ReactNode} from "react";

export interface BaseDialogProps {
    title: string;
    content: ReactNode;
    buttons: ReactNode;
}

const BaseDialog = ({title, content, buttons}: BaseDialogProps) => {
    const setDialog = useSetDialog();
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
                        <div className="bg-white p-4">
                            <h3 className="font-bold text-2xl">{title}</h3>
                            <div>
                                {content}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4">
                            {buttons}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}

export default BaseDialog;