export interface IUser {
  _id: string;
  name?: string;
  firstName?: string
  lastName?: string
  idNumber?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  country?: string;
  city?: string;
  postalCode?: string;
  createdAt: string;
  kind?: string;
  password?: string;
}

export interface IUserFilter {
  skip?: number;
  take?: number;
  keyword?: string;
  pageSize: number;
  page: number;
  kinds?: UserKindTypes[];
  fromDate?: number | Date;
  toDate?: number | Date;
}

export enum UserKindTypes {
  Admin = 'Admin',
  SuperAdmin = 'SuperAdmin',
  StoreAdmin = 'StoreAdmin',
  Staff = 'Staff',
  Customer = 'Customer',
  Supplier = 'Supplier'
}
