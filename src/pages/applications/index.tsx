import { ApGuardBuilder } from '@/guard';
import { ApplicationsPage } from '@/modules/application/page';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';
import React from 'react';

const Applications = () => {
  return (
    <MainLayout selectedKey="customer">
        <ApplicationsPage/>
    </MainLayout>
  );
};

export default Applications;

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
