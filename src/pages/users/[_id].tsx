import { ApGuardBuilder } from '@/guard';
import MainLayout from '@/modules/layout';
import { useProfileState } from '@/modules/profile/context';
import { findOneProfileAsync } from '@/modules/profile/gql/query';
import { IProfile } from '@/modules/profile/model';
import { ProfilePage } from '@/modules/profile/page';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react';

interface IProps {
  profile: IProfile;
}
const Profile: React.FC<IProps> = ({ profile }) => {
  const { setProfile, profile: cProfile } = useProfileState();

  useEffect(() => {
    setProfile(profile);
  }, []);

  return <MainLayout>{cProfile && <ProfilePage />}</MainLayout>;
};

export default Profile;

export async function getServerSideProps({ query, req }: { query: any; req: any }) {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session, req).isAuth();

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  const data = await findOneProfileAsync(query?._id, session?.user?.accessToken);

  return {
    props: {
      profile: data || null
    }
  };
}
