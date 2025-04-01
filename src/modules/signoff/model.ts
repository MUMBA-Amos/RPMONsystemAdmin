import { IApplication } from "../application/model";

export interface ISignoff {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean
  canDelete: boolean
  applicationId: string
  versionId: string
  userId: string
  projectId: string
  proposalTittle: string
  investigators: string
  agency: string
  address: string
  executiveSummary: string
  projectStatus: string
  projectStatusExplanation: string
  researcherSignature: string
  researcherSignDate: number
  institutionName: string
  institutionAddress: string
  telephone: number
  email: string
  departmentHeadSignature: string
  departmentHeadSignDate: number
  application: IApplication
}

export interface ISignoffFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface ISignoffPayload {
  applicationId: string
  versionId: string
  userId: string
  projectId: string
  proposalTittle: string
  investigators: string
  agency: string
  address: string
  executiveSummary: string
  projectStatus: string
  projectStatusExplanation: string
  researcherSignature: string
  researcherSignDate: number
  institutionName: string
  institutionAddress: string
  telephone: number
  email: string
  departmentHeadSignature: string
  departmentHeadSignDate: number
}
