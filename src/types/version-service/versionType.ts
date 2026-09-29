export interface VersionType {
    id?: string;
    major: number;
    minor: number;
    patch: number;
    build: number;
    forceUpdate: boolean;
}

export interface VersionResponseType {
    versions: VersionType[];
    errorCode: string;
    errorDescription: string;
    timestamp: string;
}