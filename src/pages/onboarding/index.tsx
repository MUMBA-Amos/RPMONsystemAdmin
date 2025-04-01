import { RegistrationPage } from '@/modules/onboard/page';
import { ProfileSectionKind } from '@/modules/profile/model';
import React from 'react';

interface IProps {
}

const Onboard: React.FC<IProps> = ({ }) => {
    return <RegistrationPage invitationId={""} inviteSections={[ProfileSectionKind.ACADEMIC, ProfileSectionKind.ACADEMIC, ProfileSectionKind.EXPERIENCE, ProfileSectionKind.AWARDS]} />;
};

export default Onboard;
