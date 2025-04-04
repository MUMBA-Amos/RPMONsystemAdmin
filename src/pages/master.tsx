import { UserKindTypes } from '@/modules/user/model';
import { getSession } from 'next-auth/react';
import MainLayout from '../modules/layout';
import MasterPage from '../modules/master/page';

const Master = () => {
  return (
    <MainLayout selectedKey="master">
      <MasterPage />
    </MainLayout>
  );
};

export default Master;

export async function getServerSideProps({ query, req }: { query: any; req: any }) {
  const session: any = await getSession({ req });

  // if (session?.user?.kind !== UserKindTypes.SuperAdmin) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permenant: true
  //     }
  //   };
  // }

  return {
    props: {}
  };
}
