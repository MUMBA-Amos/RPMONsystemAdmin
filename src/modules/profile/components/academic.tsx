import React from 'react';
import { IProfile } from '../model';
import { TbEdit } from 'react-icons/tb';
import { ApDateTime } from '@/components/date';
import { ApDeleteRowIcon, ApEditRowIcon } from '@/components';
import { useProfileState } from '../context';

interface IProps {
  profile: IProfile;
  onEdit: (item: any, index: number) => void;
}

export default function AcademicInformation({ profile, onEdit }: IProps) {
  const { updateProfile, updating } = useProfileState();

  const handleRemove = (item: any) => {
    const originalIndex = profile?.sections?.findIndex((section) => section === item);
    const sections = profile.sections
      .filter((item, i) => i !== originalIndex)
      ?.map((item, i) => {
        return {
          kind: item?.kind,
          name: item?.name,
          description: item?.description,
          fromDate: item?.fromDate,
          toDate: item?.toDate,
          institution: item?.institution,
          role: item?.role,
          qualification: item?.qualification,
          fieldOfStudy: item?.fieldOfStudy,
          contractTypeId: item?.contractType?._id
        };
      });

    const payload: any = {
      sections
    };

    updateProfile(profile?._id, payload);
  };

  return (
    <div className="border rounded-lg p-4 mb-4 shadow-md">
      <div className="flex justify-between items-center border-b pb-2 mb-2">
        <h2 className="text-lg font-semibold">Academic</h2>
      </div>

      {profile?.sections
        ?.filter((item) => item.kind == 'ACADEMIC')
        ?.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col gap-3 mt-3 ${
              profile?.sections?.filter((item) => item.kind == 'ACADEMIC')?.length !== i + 1 &&
              'border-b pb-3'
            }`}
          >
            <div className="flex justify-between">
              <p className="text-primary font-medium">Institution</p>
              <p className="text-sm">{item?.institution}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-primary font-medium">Qualification:</p>
              <p className="text-sm">{item?.qualification}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-primary font-medium"> Field Of Study:</p>
              <p className="text-sm">{item?.fieldOfStudy}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-primary font-medium">From Date:</p>
              <p className="text-sm">{item?.fromDate}</p>
            </div>

            <div className="flex justify-between">
              <p className="text-primary font-medium">To Date:</p>
              <p className="text-sm">{item?.toDate}</p>
            </div>

            <div className="flex justify-end gap-2">
              <div
                className="flex gap-2 items-center cursor-pointer"
                onClick={() => onEdit(item, i)}
              >
                <p>Edit</p>
                <TbEdit className="text-xl text-primary cursor-pointer" />
              </div>
              {/* <ApEditRowIcon onClick={() => onEdit(item, i)} /> */}
              {/* <ApDeleteRowIcon onConfirm={() => handleRemove(item)} /> */}
            </div>
          </div>
        ))}
    </div>
  );
}
