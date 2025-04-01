import { Dayjs } from 'dayjs';
import { IUser } from '../user/model';

export interface IAuditLog {
  _id: string;
  refId: string;
  status: string;
  kind: string;
  description: string;
  updates: string;
  message: string;
  createdBy: string;
  createdAt: number;
  user: IUser;
}

export interface IAuditLogFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  userId?: string;
  fromDate?: number;
  toDate?: number;
  date?: Dayjs | null;
  kind?: string;
  description?: string;
  updates?: string;
  reference?: string;
  name?: string;
}

export interface IAuditLogPayload {
  name?: string;
  createdAt?: number;
  kind?: string;
  updates?: string;
  refId?: string;
}
