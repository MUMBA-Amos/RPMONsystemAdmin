export interface IFileUpload {
    _id: string
    ref?: string
    refId?: string
    uri: string
    name: string
    cover?: boolean
    type?: string
    module?: string
    createdBy?: string
    createdAt: number
    updatedAt?: number
    canDelete?: boolean
}

export interface IFileUploadInput {
    file?: object
    files?: object[]
}

export interface IFileUploadQuery {
    refId: string,
    file: IFileUploadInput
}