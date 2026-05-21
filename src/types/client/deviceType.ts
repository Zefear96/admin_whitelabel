export interface DeviceHistoryType {
    content: Content[];
    pageable: Pageable;
    total?: number;
    totalElements?: number;
    size?: number;
    number?: number;
}

export interface Content {
    deviceFingerprint: DeviceFingerprintClass;
    lastSeenAt: string;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface Sort {
    sorted: boolean;
    empty: boolean;
    unsorted: boolean;
}

export interface DeviceFingerprintClass {
    deviceId: string;
    deviceFingerprint: string;
    deviceName: string;
    deviceType: string;
    os: string;
    osVersion: string;
    model: string;
    manufacturer: string;
    isRooted: boolean;
    isEmulator: boolean;
    locale: string;
    appVersion: string;
    networkType: string;
    carrier: string;
    macAddress: string;
    bluetoothAddress: string;
    imeiAddress: string;
    screenSize: string;
    screenResolution: string;
    ipAddress: string;
    userAgent: string;
}

export interface DeviceHistoryItem {
    lastSeenAt: string;
    deviceFingerprint: DeviceFingerprintClass;
}