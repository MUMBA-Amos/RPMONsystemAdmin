import { PermissionContextProvider } from '@/modules/permission/context';
import { SigninPage } from '../modules/auth/signin/page';

const Login = () => {
  return (
    <PermissionContextProvider>
      <SigninPage />
    </PermissionContextProvider>
  );
};

export default Login;

export async function getServerSideProps({ query, req }: { query: any; req: any }) {
  // const guard = new ApGuardBuilder((await getSession({ req })) as ISession, req).build();

  // if (!guard?.globalSsr?.serverAddress) {
  //   return {
  //     redirect: {
  //       destination: '/setup',
  //       permanent: false
  //     }
  //   };
  // }

  return {
    props: {}
  };
}
