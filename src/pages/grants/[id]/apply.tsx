import { ApGuardBuilder } from '@/guard';
import GrantApplication from '@/modules/application/create';
import { findGrantAsync } from '@/modules/grant/gql/query';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';

const ApplyGrant = ({ grant }: any) => {
  return (
    <MainLayout selectedKey="customer">
      <GrantApplication grant={grant}/>
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

  const grant = await findGrantAsync(query?.id, session.token);

  return {
    props: { grant: grant || null }
  };
}
