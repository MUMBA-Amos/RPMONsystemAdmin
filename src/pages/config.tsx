import { getSession } from "next-auth/react";
import React from "react";
import Config from "../modules/config/page";
import MainLayout from "../modules/layout";
import { ApGuardBuilder } from "@/guard";
import { USER_ACCESS } from "@/constants";

interface IProps {
  storeId: string;
}

const ConfigList: React.FC<IProps> = ({ storeId }) => {
  return (
    <MainLayout>
      <Config />
    </MainLayout>
  );
};

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
    .haveAccess(USER_ACCESS.SETTING.MODULE, USER_ACCESS.SETTING.ACTIONS.VIEW_SETTINGS, '/');

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  // const user: any = await findUserByIdAsync(session.user._id);

  return {
    props: {
      // storeId: user.roles.includes["StoreAdmin"] ? user._id : user?.storeId,
    },
  };
}
export default ConfigList;
