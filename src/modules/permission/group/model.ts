import { IPermissionModule } from "../model"

export interface IAccessGroup {
    _id: string
    group: string
    usersCount: number
    createdAt: string
    updatedAt: number
    module: IPermissionModule
}

export interface IAccessGroupQueryInput {
    group?: string
}