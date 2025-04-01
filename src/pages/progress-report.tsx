import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { ReportPage } from '@/modules/report/page';
import { getSession } from 'next-auth/react';

const Report = () => {
  return (
    <MainLayout>
      <ReportPage />
    </MainLayout>
  );
};

export const getServerSideProps = async ({ req }: any) => {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session, req);
  guard.isAuth();

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
};
export default Report;
