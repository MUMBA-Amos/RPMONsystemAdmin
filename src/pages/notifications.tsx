import { getSession } from "next-auth/react";
import React from "react";
import MainLayout from "../modules/layout";
import { NotificationPage } from "../modules/notification/page";
import { ApGuardBuilder } from "@/guard";

const Notification = () => {
  return (
    <MainLayout>
      <NotificationPage />
    </MainLayout>
  );
};

export default Notification;

export const getServerSideProps = async ({req}: any) => {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session,req);
  await guard
    .isAuth()
    // .haveAccess(USER_ACCESS.CUSTOMER.MODULE, USER_ACCESS.CUSTOMER.ACTIONS.VIEW_CUSTOMERS, '/');

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  return {
    props: {},
  };
};
