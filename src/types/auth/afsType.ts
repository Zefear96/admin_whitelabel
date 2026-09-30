export const REASON_TEXT_MAX_LENGTH = 255;

export interface RequestBodyAntifraud {
    reasonText: string;
}

export type BlockType = 'STAFF' | 'ANTIFRAUD';

export interface ResponseBlockedUserType {
    userId: string;
    blockedtype: BlockType[];
}