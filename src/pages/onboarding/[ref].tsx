import { findOneInviteAsync } from '@/modules/invitation/gql/query';
import { IInvite } from '@/modules/invitation/model';
import { RegistrationPage } from '@/modules/onboard/page';
import React from 'react';

interface IProps {
  invitationId: string;
  invite: IInvite;
}

const Onboard: React.FC<IProps> = ({ invitationId, invite }) => {
  return <RegistrationPage invitationId={invitationId} inviteSections={invite?.group?.sections} />;
};

export default Onboard;

export const getServerSideProps = async ({ query }: { query: any }) => {
  const { ref } = query;

  const data = await findOneInviteAsync(ref);

  return {
    props: { invitationId: ref || null, invite: data || null }
  };
};
