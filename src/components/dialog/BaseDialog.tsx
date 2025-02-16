import {Dialog, DialogBackdrop, DialogPanel} from '@headlessui/react'
import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";
import {ReactNode} from "react";

export interface BaseDialogProps {
    title: string;
    content: ReactNode;
    buttons: ReactNode;
    overrideClose?: () => void;
}

const BaseDialog = ({title, content, buttons, overrideClose}: BaseDialogProps) => {
    const setDialog = useSetDialog();
    return (
        <Dialog open={true} onClose={() => overrideClose?.() ?? setDialog(null)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
            />
            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex items-end justify-center text-center sm:items-center sm:p-0 max-h-screen">
                    <DialogPanel
                        transition
                        className="max-h-[calc(100vh-32px)] relative transform overflow-x-hidden overflow-y-auto rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-2xl data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
                    >
                        <div className="bg-white px-6 pt-6">
                            <h3 className="font-bold text-2xl">{title}</h3>
                        </div>
                        <div className="bg-white px-6 py-2">
                            {content}
                        </div>
                        <div className="bg-gray-50 p-6">
                            {buttons}
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
)
}

export default BaseDialog;