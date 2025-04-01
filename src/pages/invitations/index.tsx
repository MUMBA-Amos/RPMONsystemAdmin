import { ApGuardBuilder } from '@/guard';
import { InvitationPage } from '@/modules/invitation/page';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';
import React from 'react';

const Invitations = () => {
  return (
    <MainLayout selectedKey="group">
      <InvitationPage />
    </MainLayout>
  );
};

export default Invitations;

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
