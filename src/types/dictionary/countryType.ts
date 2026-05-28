export interface CountryType {
    id: string
    code: string
    litCode: string
    name: string
}

export type CountryUpdatePayload = Pick<CountryType, "id" | "name">