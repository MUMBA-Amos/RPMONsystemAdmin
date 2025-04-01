import { ComponentProps, FC } from 'react';
import { PasswordContextProvider } from './modules/auth/password/context';
import { ConfigContextProvider } from './modules/config/context';
import { DepartmentContextProvider } from './modules/department/context';
import { UploadFileContextProvider } from './modules/fileUpload/context';
import { MasterContextProvider } from './modules/master/context';
import { NotificationContextProvider } from './modules/notification/context';
import { PermissionContextProvider } from './modules/permission/context';
import { AccessGroupContextProvider } from './modules/permission/group/context';
import { ProfileContextProvider } from './modules/profile/context';
import { UserContextProvider } from './modules/user/context';
import { OrganizationContextProvider } from './modules/organization/context';
import { GrantContextProvider } from './modules/grant/context';
import { InviteContextProvider } from './modules/invitation/context';
import { BatchContextProvider } from './modules/batch/context';
import { ApplicationContextProvider } from './modules/application/context';
import { VoteHeadContextProvider } from './modules/vote-heads/context';
import { TeamMemberContextProvider } from './modules/team-members/context';
import { PublicationContextProvider } from './modules/publication/context';
import { ActivityContextProvider } from './modules/activity/context';
import { BudgetContextProvider } from './modules/budget/context';
import { AuditLogContextProvider } from './modules/audit-traiIs/context';
import { ReviewerContextProvider } from './modules/reviewer/context';
import { ReportContextProvider } from './modules/report/context';
import { ResearchContextProvider } from './modules/research/context';
import { ExtenstionContextProvider } from './modules/extenstion/context';
import { ExpenseContextProvider } from './modules/expenses/context';
import { WorkExperienceContextProvider } from './modules/work-experience/context';
import { ResearcherContextProvider } from './modules/researcher/context';
import { SignoffContextProvider } from './modules/signoff/context';
import { CommentContextProvider } from './modules/comment/context';
import { DashboardContextProvider } from './modules/dashboard/context';

export const combineContext = (...components: FC[]): FC<any> => {
  return components.reduce(
    (AccumulatedComponents: any, CurrentComponent: any) => {
      // eslint-disable-next-line react/display-name
      return ({ children }: ComponentProps<FC<any>>): JSX.Element => {
        return (
          <AccumulatedComponents>
            <CurrentComponent>{children}</CurrentComponent>
          </AccumulatedComponents>
        );
      };
    },
    ({ children }) => <>{children}</>
  );
};

const providers = [
  ConfigContextProvider,
  MasterContextProvider,
  ProfileContextProvider,
  NotificationContextProvider,
  PasswordContextProvider,
  PermissionContextProvider,
  AccessGroupContextProvider,
  UserContextProvider,
  UploadFileContextProvider,
  DepartmentContextProvider,
  OrganizationContextProvider,
  GrantContextProvider,
  InviteContextProvider,
  BatchContextProvider,
  ApplicationContextProvider,
  VoteHeadContextProvider,
  AuditLogContextProvider,
  TeamMemberContextProvider,
  PublicationContextProvider,
  ActivityContextProvider,
  BudgetContextProvider,
  ReviewerContextProvider,
  ReportContextProvider,
  ResearchContextProvider,
  ExtenstionContextProvider,
  ExpenseContextProvider,
  ResearcherContextProvider,
  WorkExperienceContextProvider,
  SignoffContextProvider,
  CommentContextProvider,
  DashboardContextProvider
] as any;

export const AppContextProvider = combineContext(...providers);
