import Button from "../primitives/buttons/Button.tsx";
import BaseDialog from "./BaseDialog.tsx";
import { configDir } from '@tauri-apps/api/path';
import {useEffect, useState} from "react";
import {getName, getVersion} from "@tauri-apps/api/app";
import {useConfig} from "../../contexts/ConfigContextProvider.tsx";
import {useSetDialog} from "../../contexts/DialogContextProvider.tsx";

interface Info {
    configDirPath: string;
    appName: string;
    appVersion: string;
}

const InfoDialog = () => {
    const [info, setInfo] = useState<Info | null>(null);
    const config = useConfig();
    const setDialog = useSetDialog();

    useEffect(() => {
        const getInfo = async () => {
            const configDirPath = await configDir();
            const appName = await getName();
            const appVersion = await getVersion();
            setInfo({configDirPath, appVersion, appName});
        }
        getInfo();
    }, []);

    return (
        <BaseDialog
            title="App Info"
            content={
                <div className="flex flex-col gap-2">
                    <div>
                        <h4 className="text-lg font-bold">App name</h4>
                        <code>{info?.appName}</code>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">App version</h4>
                        <code>{info?.appVersion}</code>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">Config directory path</h4>
                        <code>{info?.configDirPath}</code>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold">DAREG API</h4>
                        <code>{config.dareg_url}</code>
                    </div>
                </div>}
            buttons={
                <div className="flex flex-row-reverse gap-4">
                    <Button type="submit" onClick={() => setDialog(null)}>
                        Close
                    </Button>
                </div>
            }/>
    )
}

export default InfoDialog;