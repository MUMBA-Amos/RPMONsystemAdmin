import { ApGuardBuilder } from '@/guard';
import { BatchPage } from '@/modules/batch/page';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';
import React from 'react';

const Batches = () => {
  return (
    <MainLayout selectedKey="batches">
      <BatchPage />
    </MainLayout>
  );
};

export default Batches;

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
