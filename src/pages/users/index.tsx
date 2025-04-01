import React from 'react';
import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { UsersPage } from '@/modules/user/page';
import { getSession } from 'next-auth/react';

const Users = () => {
  return (
    <MainLayout selectedKey="sales">
      <UsersPage />
    </MainLayout>
  );
};

export default Users;

export async function getServerSideProps({ query, req }: { query: any; req: any }) {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session, req);
  await guard.isAuth();

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  return {
    props: {}
  };
}
