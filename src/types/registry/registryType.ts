export interface RegistryType {
    agent: string
    task: Task
}

export interface Task {
    id: string
    agent: string
    hash: string
    requestParams: RequestParams
    status: string
    createdDate: string
    startedDate: string
    finishedDate: string
    resultRef: string | null
    errorMessage: string | null
}

export interface RequestParams {
    agent: string
    dateFrom: string
    dateTo: string
}
