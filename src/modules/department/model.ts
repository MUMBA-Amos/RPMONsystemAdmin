import { IUser } from '../user/model';

export interface IDepartment {
  _id: string;
  name?: string;
  hodId?: string;
  hod?: IUser;
  createdAt?: string;
}

export interface IDepartmentQueryInput {
  _id?: string;
  name?: string;
}

export interface IDepartmentFilter extends IDepartmentQueryInput {
  page: number;
  pageSize: number;
  keyword?: string;
}
