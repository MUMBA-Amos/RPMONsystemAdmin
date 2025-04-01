import { IMaster } from "../master/model";

export interface IWorkExperience {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean
  canDelete: boolean
  researcherId: string
  role: string
  description: string
  institutionId: string
  institutionName: string
}

export interface IWorkExperienceFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IWorkExperiencePayload {
  researcherId: string
  reportId: string
  role: string
  description: string
  institutionId: string
  institutionName: string
}
