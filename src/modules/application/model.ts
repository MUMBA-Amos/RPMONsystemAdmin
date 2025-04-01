import { IActivity } from '../activity/model';
import { IBudget } from '../budget/model';
import { IComment } from '../comment/model';
import { IExpense } from '../expenses/model';
import { IExtenstion } from '../extenstion/model';
import { IGrant } from '../grant/model';
import { IProfile } from '../profile/model';
import { IPublication } from '../publication/model';
import { IReport } from '../report/model';
import { IReviewer } from '../reviewer/model';
import { ITeamMember } from '../team-members/model';

export interface IApplication {
  _id: string;
  ref: string;
  status?: ApplicationStatus;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  grantId: string;
  researchFocus: string;
  proposalTitle: string;
  executiveSummary: string;
  rationalAndBackground: string;
  designAndMethod: string;
  additionalComments: string;
  comment: string;
  revision: string
  hasExtension: boolean;
  grant: IGrant;
  reports: IReport[];
  finalReport: IReport;
  showReviewers: boolean;
  hasFinalReport: boolean;
  hasProgressReport: boolean;
  publications: IPublication[];
  members: ITeamMember[];
  budgets: IBudget[];
  expenses: IExpense[];
  activities: IActivity[];
  reviewers: IReviewer[];
  approvers: IReviewer[];
  comments: IComment[];
  researcher: IProfile;
  extensions: IExtenstion[];
  applicationStatuses: string[];
}

export interface IApplicationFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IApplicationPayload {
  grantId: string;
  researchFocus: string;
  proposalTitle: string;
  executiveSummary: string;
  rationalAndBackground: string;
  designAndMethod: string;
}


export interface IApplicationStatusUpdate {
  _id: string;
  status: ApplicationStatus;
  comment: string;
}


export enum GrantTypes {
  MARCHING = 'MARCHING',
  NORMAL = 'NORMAL'
}

export enum ApplicationStatus {
  DRAFT = 'DRAFT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT'
}


export function getStatusClassName(status: string) {

  switch (status) {
    case "APPROV":
      return "bg-green-400"
    case "APPROVED":
      return "!bg-green-400"
    case "REJECT":
      return "bg-red-400"
    case "REJECTED":
      return "bg-red-400"
    default:
      return ""
  }
}
