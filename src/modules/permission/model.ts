export interface IPermissionAction {
  _id?: string;
  moduleId?: string;
  action?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: number;
  hasPermission?: boolean;
  module?: IPermissionModule[];
}

export interface IPermissionModule {
  _id?: string;
  moduleId?: string;
  actions?: IPermissionAction[];
  children?: IPermissionAction[];
  name?: string;
  createdAt?: string;
  updatedAt?: number;
}

export interface IPermissionModuleQueryInput {
  moduleId?: string;
  action?: string;
  name?: string;
  groupId: string;
}

export interface ICreatePermissionInput {
  moduleId: string;
  actionId: string;
  groupId: string;
}

export enum PermissionRole {
  SuperAdmin = "SuperAdmin",
  Admin = "Admin",
  Customer = "Customer",
  StoreAdmin = "StoreAdmin",
  Staff = "Staff",
  Salesman = "Salesman",
}


export enum CheckActionTypes {
  CHECK_ALL = "CHECK_ALL",
  UNCHECK_ALL = "UNCHECK_ALL",
}


export interface IUpdatePermissionInput {
  groupId: string,
  action: CheckActionTypes,
  moduleId?: string
}

export interface ICheckAcessInput{
  userId: string;
  action: string;
  module: string;
}