import {createContext, ReactNode, useContext, useState} from "react";

interface DialogContextType {
    setDialog: (dialog: ReactNode) => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(undefined);
export const useSetDialog = () => useContext(DialogContext)!.setDialog;

const DialogContextProvider = ({children}: {children: ReactNode}) => {
    const [dialog, setDialog] = useState<ReactNode | null>(null);

    return (
        <DialogContext.Provider value={{setDialog}}>
            {dialog}
            {children}
        </DialogContext.Provider>
    );
}


export default DialogContextProvider;