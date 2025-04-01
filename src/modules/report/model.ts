import { IActivity } from '../activity/model';
import { IBudget } from '../budget/model';
import { IExpense } from '../expenses/model';
import { IExtenstion } from '../extenstion/model';
import { IPublication } from '../publication/model';
import { IResearch } from '../research/model';
import { IResearcher } from '../researcher/model';
import { IReviewer } from '../reviewer/model';
import { ISignoff } from '../signoff/model';




export interface IReport {
  _id: string;
  ref: string;
  applicationId: string;
  organizationId: string;
  createdBy: string;
  createdAt: number;
  updatedBy: string;
  updatedAt: number;
  canUpdate: boolean;
  canDelete: boolean;
  title: string;
  showApproval: boolean;
  showEndorsement: boolean;
  researchSummary: string;
  futureResearchDescription: string;
  researchCollaboration: string;
  description: string;
  research: IResearch;
  researcher: IResearcher;
  activities: IActivity[];
  milestones: IActivity[];
  researchers: IResearcher[];
  // extenstion: IExtenstion
  publications: IPublication[];
  expenses: IExpense[];
  budgets: IBudget[];
  signOff: ISignoff;
  extension: IExtenstion;
  approvers: IReviewer[];
  reviewers: IReviewer[];
  
  fromDate: number;
  toDate: number;
  projectOverview: string;
  collaborationOverview: string;
}

export interface IReportFilter {
  page: number;
  applicationId?: string;
  pageSize: number;
  keyword?: string;
  name?: string;
}

export interface IReportPayload {
  applicationId: string;
  title: string;
  description: string;
}

export interface ICreateReportInput {
  applicationId: string;
  title: string;
  description: string;
}
