import { IMaster } from '../master/model';
import { IOrganization } from '../organization/model';

export interface IGrant {
  _id: string;
  ref?: string;
  name: string;
  toDate: number;
  fromDate: number;
  clusterId: string;
  schemeId: string;
  batchId: string;
  budget: number;
  description: string;
  status: GrantStatusTypes;
  batch: IBatch;
  cluster: IMaster;
  scheme: IMaster;
  organization: IOrganization;
  createdAt: number;
}

enum GrantStatusTypes {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED'
}

export interface IBatch {
  _id: string;
  name: string;
  description: string;
}

export interface IGrantFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IGrantPayload {
  name: string;
  toDate: number;
  fromDate: number;
  clusterId: string;
  batchId: string;
  budget: number;
}
