import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';
import { GrantPage } from '@/modules/grant/page';
import React from 'react';
import { findGrantAsync } from '@/modules/grant/gql/query';
import GrantApplication from '@/modules/application/create';
import { IGrant } from '@/modules/grant/model';

const ApplyGrant = ({ grant }: { grant: IGrant }) => {
  return (
    <MainLayout selectedKey="customer">
      <GrantApplication grant={grant} />
    </MainLayout>
  );
};

export default ApplyGrant;

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

  console.log({ sessionToken: session?.token });
  const grant = await findGrantAsync(query?.id, session.token);
  console.log({ grantsApply: query?.id });

  return {
    props: { grant: grant || null }
  };
}
