import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { findApplicationAsync } from '@/modules/application/gql/query';
import ApplicationDetailPage from '@/modules/application/detail';
import GrantApplication from '@/modules/application/create';
import { useApplicationState } from '@/modules/application/context';

const EditApplication = ({ application }: any) => {
  const {application: cApplication, setApplication} = useApplicationState()

  useEffect(() => {
    setApplication(application)
  }, [application])

  return (
    <MainLayout selectedKey="customer">
      {cApplication && (
        <GrantApplication />
      )}
    </MainLayout>
  );
};

export default EditApplication;

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

  const application = await findApplicationAsync(query?.id, session.token);

  return {
    props: { application: application || null }
  };
}
