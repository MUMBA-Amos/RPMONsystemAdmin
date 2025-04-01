import { DefaultSession } from "next-auth";

export interface ISession extends DefaultSession {
  user: {
    _id?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    roles?: string[] | null;
    companyId?: string | null;
    storeId?: string | null;
    accessToken?: string | null;
  };
  token?: string;
  brandId: string;
  campaignManagerId: string,
  campaignOperatorId: string,
}
