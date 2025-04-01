export interface IBatch {
  _id: string;
  name: string;
  description: string;
}

export interface IBatchFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
}
