import moment from 'moment';
import { AP_END_POINTS } from './Endpoint';
import { USER_ACCESS } from './UserAccess';

export const DEFAULT_PAGE_SIZE = 50;

export const DEFAULT_CURRENCY = 'MYR';

export enum ApRoleTypes {
  SuperAdmin = 'SuperAdmin',
  StoreAdmin = 'StoreAdmin',
  Member = 'Member',
  Admin = 'Admin',
  Staff = 'Staff'
}

export const ApRoute = {
  Products: '/product',
  StoreDetail: '/store/detail',
  StaffDetail: '/staff/detail',
  AgentDetail: '/agent/detail'
};

export const AP_DATE_TIME_FORMAT = 'DD MMM YYYY hh:mm a';
export const AP_DATE_FORMAT = 'DD MMM YYYY';
export const AP_TIME_FORMAT = 'hh:mm a';
export const AP_CALENDAR_DATE_FORMAT = 'DD/MM/YYYY'; //['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY'];



export const PHONE_VALIDATION =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const initFilterProps = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  toDate: moment().endOf('day').valueOf(),
  fromDate: moment().startOf('day').valueOf()
};

export { AP_END_POINTS, USER_ACCESS };

/**
 * pages without the protection
 * notification
 * kyc
 * Company
 * banner
 * tv dashboard
 * suplier /id/account and some others
 * stock adjustment
 * stock transfer
 * inventory count
 * inventory valuation details
 * inventory valuation summary
 * inventory
 * stock movement summary
 * stock movement
 * trade payable
 * trade receivale
 * maintaince department
 * maintaince / rate /display
 * item pricing
 * permission (should be under setup)
 * item/id pages also
 * invoice 
 * receipt
 * employee/id/order
 * setup
 */