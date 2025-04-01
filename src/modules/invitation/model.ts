import { IOrganization } from '../organization/model';
import { IAccessGroup } from '../permission/group/model';

export interface IInvite {
  _id: string;
  name: string;
  email: string;
  organizationId: string;
  groupId: string;
  organization: IOrganization;
  group: IAccessGroup;
  createdAt: string;
}

export interface IInviteFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}
