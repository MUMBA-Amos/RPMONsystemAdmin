export const ProfilePages = {
  Edit: "Edit",
  Notifications: "Notifications",
  Security: "Security",
  page: "Page",
};

export interface IProfile {
  id: string;
  _id: string;
  referralId: string;
  idNumber: string;
  username: string;
  name: string;
  email: string;
  phoneNumber: string;
  active: boolean;
  roles: [];
  address: string;
  latitude: string;
  longitude: string;
}
