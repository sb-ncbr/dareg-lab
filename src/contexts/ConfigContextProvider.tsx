import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";
import axios, {InternalAxiosRequestConfig} from "axios";
import EmptyLayout from "../components/layout/EmptyLayout.tsx";

interface Config {
    token: string;
    dareg_url: string;
}

const configContext = createContext<Config | null>(null);

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
            requestConfig.baseURL = config.dareg_url;
            return requestConfig;
        }
        const authorizationInterceptor = axios.interceptors.request.use(authorization);

        return () => {
            axios.interceptors.request.eject(authorizationInterceptor);
        };
    }, [config]);

    return (
        <configContext.Provider value={config}>
            {config ? children : <EmptyLayout />}
        </configContext.Provider>
    )
}

export const useConfig = () => useContext(configContext)!;

export default ConfigContextProvider;