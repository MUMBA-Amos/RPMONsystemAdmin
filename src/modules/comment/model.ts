import type { IUser } from '../user/model';

export interface IComment {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean;
  canDelete: boolean;
  comment: string;
  userId: string;
  parentId: string;
  refId: string;
  propName: string;
  user: IUser;
}

export interface ICommentFilter {
  _id?: string;
  keyword?: string;
  name?: string;
  comment?: string;
  userId?: string;
  parentId?: string;
  refId?: string;
  propName?: string;
}

export interface ICommentPayload {
  comment: string;
  userId?: string;
  parentId?: string;
  refId: string;
  propName?: string;
}
