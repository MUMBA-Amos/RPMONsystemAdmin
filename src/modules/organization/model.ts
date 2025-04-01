export interface IOrganization {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export interface IOrganizationFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  fromDate?: number;
  toDate?: number;
}
