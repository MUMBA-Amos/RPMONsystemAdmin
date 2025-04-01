export enum ActivityTypes {
  MILESTONE = 'MILESTONE',
  OBJECTIVE = 'OBJECTIVE',
  ACTIVITY = 'ACTIVITY'
}

export interface IActivity {
  _id: string;
  ref: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  type: ActivityTypes;
  parentId: string;
  applicationId: string;
  name: string;
  percentage: number;
  description: string;
  toDate: number;
  fromDate: number;
}

export interface IActivityFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IActivityPayload {
  type: ActivityTypes
  parentId: string
  applicationId: string
  name: string
  description: string
  toDate: number
  fromDate: number
  children: IActivityPayload[]
}
