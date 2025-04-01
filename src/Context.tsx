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
] as any;

export const AppContextProvider = combineContext(...providers);
