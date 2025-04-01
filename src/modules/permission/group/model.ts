import { IPermissionModule } from '../model';

export interface IAccessGroup {
  _id: string;
  group: string;
  usersCount: number;
  createdAt: string;
  updatedAt: number;
  module: IPermissionModule;
  sections: string[];
}

export interface IAccessGroupQueryInput {
  group?: string;
}
