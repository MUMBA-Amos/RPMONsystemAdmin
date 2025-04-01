import { IReport } from '../report/model';
import { IReviewer } from '../reviewer/model';

export interface IExtenstion {
  _id: string;
  ref: string;
  status: string;
  organizationId: string;
  applicationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean
  canDelete: boolean
  reportId: string
  hasExtenstion: boolean
  duration: string
  justification: string
  workplan: string
  deviationReason: string
  remedialAction: string
  report: IReport
  reviewers: IReviewer[]
  showReviewers: boolean;
  extensionStatuses: string[]
}

export interface IExtenstionFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
  applicationId?: string;
}

export interface IExtenstionPayload {
  reportId: string
  hasExtenstion: boolean
  duration: string
  justification: string
  workplan: string
  deviationReason: string
  remedialAction: string
}


export interface IExtenstionStatusUpdate{
 _id: string
 status: string
 comment: string
}