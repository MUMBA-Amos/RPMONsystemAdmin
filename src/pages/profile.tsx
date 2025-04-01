import React from "react";
import { getSession } from "next-auth/react";
import { IProfile } from "../modules/profile/model";
import { ApPageTitle } from "../components";
import { findCurrentUserAsync } from "../modules/profile/gql/query";
import MainLayout from "../modules/layout";
import { ProfilePage } from "../modules/profile/page";
import { ApGuardBuilder } from "@/guard";

interface IProps {
  profile: IProfile;
}

const CustomerDetail: React.FC<IProps> = ({ profile }) => {
  return (
    <MainLayout> 
     <ProfilePage profile={profile}/>
    </MainLayout>
  );
};

export default CustomerDetail;

export async function getServerSideProps({
  query,
  req,
}: {
  query: any;
  req: any;
}) {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session,req);
  await guard
    .isAuth()
    // .haveAccess(USER_ACCESS.FINANCE.MODULE, USER_ACCESS.FINANCE.ACTIONS.VIEW_TRANSACTIONS, '/');

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  const profile = await findCurrentUserAsync(session.token);

  return {
    props: { profile },
  };
}
