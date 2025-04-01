import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { ReviewerPage } from '@/modules/reviewer/page';
import { getSession } from 'next-auth/react';

const Nominations = () => {
  return (
    <MainLayout selectedKey="nominations">
      <ReviewerPage/>
    </MainLayout>
  );
};

export default Nominations;

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
