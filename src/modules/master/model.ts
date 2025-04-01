export interface IMaster {
  _id: string;
  name: string;
  key?: string;
  parentId?: string;
  createdAt: string;
  children?: IMaster[];
  categories?: string[];
  categoryList?: IMaster[];
  parent?: IMaster;
  image?: { _id: string; uri: string };
}

export interface IMasterFilter {
  page: number;
  keyword?: string;
  pageSize: number;
}

export interface PageParam {
  skip: number;
  take?: number;
  parentId?: string;
  keyword?: string;
}
