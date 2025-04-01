import React from 'react';
import { FaUser } from 'react-icons/fa6';
import { ApText } from '../../../components';
import { IProfile } from '../model';

interface IProps {
  profile: Partial<IProfile>;
}

export const ProfileView: React.FC<IProps> = ({ profile }) => {
  return (
    <div className="flex gap-6 bg-slate-100 p-3  items-center">
      <div className="w-12 rounded-full bg-stone-400 h-12 flex items-center justify-center">
        <FaUser size={30} color="white" />
      </div>
      <div>
        <ApText font="bold">{profile?.name}</ApText>
        <ApText color="muted">{profile?.email}</ApText>
      </div>
    </div>
  );
};
