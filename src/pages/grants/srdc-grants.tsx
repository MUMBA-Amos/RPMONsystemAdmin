import { ApGuardBuilder } from '@/guard';
import { GrantPage } from '@/modules/grant/page';
import MainLayout from '@/modules/layout';
import { getSession } from 'next-auth/react';

const Grants = () => {
    return (
        <MainLayout selectedKey="customer">
            <GrantPage />
        </MainLayout>
    );
};

export default Grants;

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
