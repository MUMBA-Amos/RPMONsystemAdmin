import React from 'react';
import { IProfile } from '../model';
import { TbEdit } from 'react-icons/tb';
import { ApDateTime } from '@/components/date';

interface IProps {
  profile: IProfile,
  onEdit: () => void
}

export default function ProfessionalInformation({ profile, onEdit }: IProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold">Professional Information</h2>

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={onEdit}
        >
          <p>Edit</p>
          <TbEdit className="text-xl text-primary cursor-pointer" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="flex justify-between">
          <p className="text-primary">Organization</p>
          <p>{profile?.organization?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Office Number:</p>
          <p>{profile?.officeNumber}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Designation:</p>
          <p>{profile?.designation?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Research Cluster (S):</p>

          <div className='flex items-center'>
            {profile?.researchClusters?.map((item, i) => (
              <p key={i}>{item?.name} ,</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
