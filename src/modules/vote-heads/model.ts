export interface IVoteHead {
  _id: string
  name: string
  description: string
  amount: number
  createdAt: string
}

export interface IVoteHeadFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}
