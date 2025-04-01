import { IApplication } from "../application/model";


export interface IResearch {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean
  canDelete: boolean
  version: string
  applicationId: string
  reportId: string
  overview: string

  methodology: string
  results: string
  deviationExplanation: string
  remedialAction: string
  requestExtention: string
  duration: string
  explanation: string
  application: IApplication
}

export interface IResearchFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IResearchPayload {
  version: string
  applicationId: string
  reportId: string
  overview: string
  methodology: string
  results: string
  deviationExplanation: string
  remedialAction: string
  requestExtention: string
  duration: string
  explanation: string
}
