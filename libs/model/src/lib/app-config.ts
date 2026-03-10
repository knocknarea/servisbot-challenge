/**
 * An enum of the different environments/deployments
 * understood by SLDC
 *
 * @export
 * @enum {number}
 */
export enum DeploymentType {
    PRODUCTION = 'production',
    UAT = 'uat',
    STAGE = 'stage',
    LOCAL = 'local'
}

/**
 * What 'kind' of build is this
 *
 * @export
 * @enum {number}
 */
export enum BuildType {
    PRODUCTION = 'production',
    DEVELOPMENT = 'development'
}

/**
 * Minimal application configuration, sufficient for
 * any factories or decision making processes of shared
 * libraries.
 *
 * Extend this interface to add additional attributes at the 
 * concrete implementation project level.
 * 
 * @export
 * @interface AppConfig
 */
export interface AppConfig {

    /**
     * Unique name of the application amongst all 
     * developed applications
     *
     * @type {string}
     * @memberof AppConfig
     */
    serviceName: string;

    /**
     * If known may not be so relevant
     *
     * @type {string}
     * @memberof AppConfig
     */
    version?: string;

    /**
     * Where the application is deployed.
     *
     * @type {DeploymentType}
     * @memberof AppConfig
     */
    deploymentType: DeploymentType;

    /**
     * What kind of build is it.
     *
     * @type {BuildType}
     * @memberof AppConfig
     */
    buildType: BuildType;
}

/**
 * A configuration mimimal more focused on client applications
 *
 * @export
 * @interface ClientAppConfig
 * @extends {AppConfig}
 */
export interface ClientAppConfig extends AppConfig {
    botServiceUrl: string
}