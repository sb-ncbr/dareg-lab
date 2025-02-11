import {Fragment, PropsWithChildren, useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import axios, {InternalAxiosRequestConfig} from "axios";
import EmptyLayout from "../components/layout/EmptyLayout.tsx";

interface Config {
    token: string;
    provider_host: string;
}

const ConfigContextProvider = ({children}: PropsWithChildren) => {
    const [config, setConfig] = useState<Config | null>(null);

    useEffect(() => {
        invoke("get_config")
            .then((config) => {
                setConfig(config as Config);
            })
            .catch((error) => {
                console.error(error);
            })
    }, []);

    useEffect(() => {
        if (config === null) {
            return;
        }

        const authorization = (requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
            requestConfig.headers.setAuthorization(`Token ${config.token}`);
            return requestConfig;
        }
        const handle = axios.interceptors.request.use(authorization);

        return () => {
            axios.interceptors.request.eject(handle);
        };
    }, [config]);

    return (
        <Fragment>
            {config ? children : <EmptyLayout />}
        </Fragment>
    )
}

export default ConfigContextProvider;