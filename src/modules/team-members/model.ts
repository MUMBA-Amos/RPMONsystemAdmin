import { IComment } from '../comment/model';
import { IMaster } from "../master/model";
import { IUser } from "../user/model";

export interface ITeamMember {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  name: string;
  email: string;
  userId: string;
  roleId: string;
  applicationId: string;
  user: IUser;
  role: IMaster;
  comments: IComment[];
}

export interface ITeamMemberFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface ITeamMemberPayload {
  name?: string
  email?: string
  userId?: string
  roleId?: string
  applicationId?: string
}
