import { IApplication } from '../application/model';
import { IComment } from '../comment/model';
import { IMaster } from '../master/model';
import { IUser } from '../user/model';

export interface IReviewer {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  status: string;
  comment: string;
  applicationId: string;
  reviewerId: string;
  application: IApplication;
  reviewer: IUser;
  comments: IComment[];
}

export interface IReviewerFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IReviewerPayload {
  status: string;
  comment: string;
  applicationId: string;
  reviewerId?: string;
}
