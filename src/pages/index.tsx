import { ApGuardBuilder } from '@/guard';
import { Dashboard } from '@/modules/dashboard';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';

interface IProps {
  dashboard: any;
}

const Home: React.FC<IProps> = ({ dashboard }) => {
  return <MainLayout >
    <Dashboard />
  </MainLayout>
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
export default Home;
