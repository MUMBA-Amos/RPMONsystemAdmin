import React from 'react';
import { IProfile } from '../model';
import { TbEdit } from 'react-icons/tb';
import { ApDateTime } from '@/components/date';

interface IProps {
    profile: IProfile,
    onEdit: () => void
}

export default function PersonalInformation({ profile, onEdit }: IProps) {
  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold">Personal Information</h2>

        <div
          className="flex gap-2 items-center cursor-pointer"
          onClick={onEdit}
        >
          <p>Edit</p>
          <TbEdit className="text-xl text-primary cursor-pointer" />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
        <div>
          <p className="font-semibold">
            {profile?.user?.firstName} {profile?.user?.lastName}
          </p>
          <p className="text-sm text-gray-500">NIC: {profile?.user?.idNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="flex justify-between">
          <p className="text-primary">First Name:</p>
          <p>{profile?.user?.firstName}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Last Name:</p>
          <p>{profile?.user?.lastName}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Salutation:</p>
          <p>{profile?.user?.title?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Gender:</p>
          <p>{profile?.user?.gender?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Email:</p>
          <p>{profile?.user?.email}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Race:</p>
          <p>{profile?.user?.nationality?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Identity Type:</p>
          <p>{profile?.user?.idType?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Identity Number:</p>
          <p>{profile?.user?.idNumber}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Phone:</p>
          <p>{profile?.user?.phoneNumber}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Residence Status:</p>
          <p>{profile?.residenceStatus?.name}</p>
        </div>

        <div className="flex justify-between">
          <p className="text-primary">Date of Birth:</p>
          <p>
            <ApDateTime date={profile?.user?.dateOfBirth} />
          </p>
        </div>
      </div>
    </div>
  );
}
