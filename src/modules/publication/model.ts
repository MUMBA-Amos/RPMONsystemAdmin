import { IComment } from '../comment/model';
import { IMaster } from "../master/model";



export interface IPatent {
  _id: string;
  reportId: string;
  applicationId: string;
  type: string;
  description: string;
  inventors: string;
  attachements: string;
  issueDate: number;
}

export interface IPublication {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  title: string;
  tier: string;
  applicationId: string;
  reportId: string
  paperTypeId: string;
  status: string;
  year: number;
  doi: string;
  url: string;
  submittedTo: string;
  paperType: IMaster;
  comments: IComment[];
}

export interface IPublicationFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IPublicationPayload {
  title: string
  tier: string
  paperTypeId: string
  status: string
  year: number
  doi: string
  url: string
  submittedTo: string
  reportId?: string
}
