import { UserKindTypes } from "@/modules/user/model";
import { getSession } from "next-auth/react";
import { SetupLayout } from "../modules/layout";
import { MasterContextProvider } from "../modules/master/context";
import MasterPage from "../modules/master/page";

const Store = () => {
  return (
    <MasterContextProvider>
      <SetupLayout selectedKeys={['master-data']}>
        <MasterPage />
      </SetupLayout>
    </MasterContextProvider>
  );
};

export default Store;

export async function getServerSideProps({
    query,
    req,
}: {
    query: any;
    req: any;
}) {
    const session: any = await getSession({ req });

    if (session?.user?.kind !== UserKindTypes.SuperAdmin) {
        return {
            redirect: {
                destination: "/",
                permenant: true
            }
        };
    }

    return {
        props: {},
    };
}
