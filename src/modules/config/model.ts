

export interface IConfig {
  _id: string;
  welcomeMessage: string;
  contactWhatsappNumber: string;
  androidVersion: number;
  androidForceUpdate: string;
  testUsers: string;
  iosVersion: string;
  iosForceUpdate: boolean;
  supportTeamContacts: string;
  supportPaymentMessage: string;
  // store
  defaultStoreId: string;

}
