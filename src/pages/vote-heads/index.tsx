import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { VoteHeadPage } from '@/modules/vote-heads/page';
import { getSession } from 'next-auth/react';
import React from 'react';

const VoteHead = () => {
  return (
    <MainLayout selectedKey="vote-heads">
      <VoteHeadPage />
    </MainLayout>
  );
};

export default VoteHead;

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
