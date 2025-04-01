import { GrantTypes } from '../application/model';
import { IComment } from '../comment/model';
import { IMaster } from '../master/model';
import { IVoteHead } from '../vote-heads/model';

export interface IBudget {
  _id: string;
  applicationId: string;
  reportId?: string
  year: number;
  description: string;
  grantType: GrantTypes;
  comments: IComment[];
  voteHeads: IBudgetVoteHead[];
}

export interface IBudgetVoteHead {
  voteHeadId: string;
  amount: number;
  description: string;
  voteHead: IVoteHead;
}

export interface IBudgetFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IBudgetPayload {
  applicationId: string;
  reportId?: string
  year: number;
  // grantType: GrantTypes;
  voteHeads: Array<{
    voteHeadId: string;
    description: string;
  }>;
}
