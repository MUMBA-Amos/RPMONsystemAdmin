import { IApplication } from "../application/model";

export interface IExpense {
  _id: string;
  voteheadId: string
  applicationId: string
  reportId?: string
  quantity: string
  vendor: string
  description: string
  invoiceDate: number
  invoiceNumber: number
  invoiceAmount: number
  origin: string
  paymentAmount: number
  paymentDate: number
  milestone: string
  application: IApplication
}

export interface IExpenseFilter {
  page: number;
  pageSize: number;
  keyword?: string;
  name?: string;
  fromDate?: number;
  toDate?: number;
}

export interface IExpensePayload {
  voteheadId: string
  applicationId: string
  reportId?: string
  quantity: string
  vendor: string
  description: string
  invoiceDate: number
  invoiceNumber: number
  invoiceAmount: number
  origin: string
  paymentAmount: number
  paymentDate: number
  milestone: string
}
