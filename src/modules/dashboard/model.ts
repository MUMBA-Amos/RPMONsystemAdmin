import { IApplication } from '../application/model';
import { IAuditLog } from '../audit-traiIs/model';
import { IGrant } from '../grant/model';

export interface IDashboardReport {
  availableGrantsCount: number;
  endorsementCount: number;
  applicationsCount: number;
  approvedApplicationsCount: number;
  nominationsCount: number;
  activities: IAuditLog[];
  applicationTrends: IReportDateGroup[];
  userEngatementTrends: IReportDateGroup[];
  applications: IApplication[];
  grants: IGrant[];
}

interface IReportDateGroup {
  date: string;
  count: number;
}
