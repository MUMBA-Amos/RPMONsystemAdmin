import { IMaster } from "../master/model";
import { IWorkExperience } from "../work-experience/model";

export interface IResearcher {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  supervisorId: string
  firstName: string
  middleName: string
  lastName: string
  studyLevel: string
  nationality: string
  studyStatus: StudyStatus
  isStudent: boolean
  expriences: IWorkExperience[]

  name?: string;
  position?: string;
  service?: string;
  organization?: string;
  residenceStatus?: string;
}

export enum StudyStatus {
  ONGOING = 'ONGOING',
  GRADUATE = 'GRADUATE'
}

export interface IResearcherFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IResearcherPayload {
  supervisorId: string
  firstName: string
  middleName: string
  lastName: string
  studyLevel: string
  nationality: string
  studyStatus: StudyStatus
  isStudent: boolean
  reportId: string
}
