import { BuildType, ClientAppConfig, DeploymentType } from "@servisbot/model";
import { createContext } from "react";

export default function buildConfig(): ClientAppConfig {
    return {
        serviceName: import.meta.env.VITE_APP_NAME,
        deploymentType: DeploymentType.LOCAL,
        buildType: BuildType.DEVELOPMENT,
        botServiceUrl: import.meta.env.VITE_BOT_SERVICE_URL
    }
}

export const ConfigContext = createContext(buildConfig());