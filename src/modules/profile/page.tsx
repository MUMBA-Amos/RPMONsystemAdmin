import React, { useState } from 'react';
import { IProfile } from './model';
import { TbEdit } from 'react-icons/tb';
import { ApBodyContainer, ApModal } from '@/components';
import { ApDateTime } from '@/components/date';
import UpdatePersonalInformation from './components/update/personal';
import { useProfileState } from './context';
import UpdateProfessionalInformation from './components/update/professional';
import PersonalInformation from './components/personal';
import ProfessionalInformation from './components/professional';
import UpdateExpertiseInformation from './components/update/expertise';
import ExpertiseInformation from './components/expertise';
import AcademicInformation from './components/academic';
import UpdateAcademicInformation from './components/update/academic';
import ExperienceInformation from './components/experience';
import UpdateExperienceInformation from './components/update/experience';
import QualificationInformation from './components/qualification';
import UpdateQualificationInformation from './components/update/qualification';
import AwardInformation from './components/awards';
import UpdateAwardInformation from './components/update/award';

interface IProps {}

export const ProfilePage: React.FC<IProps> = ({}) => {
  const [modal, setModal] = useState<{
    show: boolean;
    type?: string;
    data?: any;
    dataIndex?: number;
  }>({
    show: false,
    type: 'personal'
  });

  const { profile } = useProfileState();

  return (
    <ApBodyContainer className=" bg-white  rounded-lg">
      <div className="flex flex-col gap-5">
        <PersonalInformation
          profile={profile}
          onEdit={() => setModal({ show: true, type: 'PERSONAL' })}
        />

        <ProfessionalInformation
          profile={profile}
          onEdit={() => setModal({ show: true, type: 'PROFESSIONAL' })}
        />

        {profile?.sections?.filter((item) => item.kind == 'ACADEMIC')?.length > 0 && (
          <AcademicInformation
            profile={profile}
            onEdit={(item, i) => setModal({ show: true, type: 'ACADEMIC', data: item })}
          />
        )}

        {profile?.sections?.filter((item) => item.kind == 'EXPERIENCE')?.length > 0 && (
          <ExperienceInformation
            profile={profile}
            onEdit={(item, i) => setModal({ show: true, type: 'EXPERIENCE', data: item })}
          />
        )}

        {profile?.sections?.filter((item) => item.kind == 'QUALIFICATION')?.length > 0 && (
          <QualificationInformation
            profile={profile}
            onEdit={(item, i) => setModal({ show: true, type: 'QUALIFICATION', data: item })}
          />
        )}

        {profile?.sections?.filter((item) => item.kind == 'AWARDS')?.length > 0 && (
          <AwardInformation
            profile={profile}
            onEdit={(item, i) => setModal({ show: true, type: 'AWARDS', data: item })}
          />
        )}

        {profile?.sections?.filter((item) => item.kind == 'EXPERTISE')?.length > 0 && (
          <ExpertiseInformation
            profile={profile}
            onEdit={(item, i) => setModal({ show: true, type: 'EXPERTISE', data: item })}
          />
        )}
      </div>

      {/* {profile?.sections?.map((section, index) => (
        <div key={index} className="border rounded-lg p-4 mb-4 shadow-md">
          <div className="flex justify-between items-center border-b pb-2 mb-2">
            <h2 className="text-lg font-semibold">{section.kind}</h2>
            <div
              className="flex gap-2 items-center cursor-pointer"
              onClick={() =>
                setModal({ show: true, type: section?.kind.toLowerCase(), data: section })
              }
            >
              <p>Edit</p>
              <TbEdit className="text-xl text-primary cursor-pointer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {section?.kind === 'CONTRACT' && (
              <>
                <div className="flex justify-between">
                  <p className="text-primary">Contract:</p>
                  <p>{section.name}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Contract Type:</p>
                  <p>{section.contractType?.name}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">From Date:</p>
                  <p>
                    <ApDateTime date={section.fromDate} />
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">To Date:</p>
                  <p>
                    <ApDateTime date={section.toDate} />
                  </p>
                </div>
              </>
            )}
            {section?.kind === 'ACADEMIC' && (
              <>
                <div className="flex justify-between">
                  <p className="text-primary">Institution:</p>
                  <p>{section.institution}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Field of Study:</p>
                  <p>{section.fieldOfStudy}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Qualification:</p>
                  <p>{section.qualification}</p>
                </div>
              </>
            )}
            {section?.kind === 'QUALIFICATION' && (
              <div className="flex justify-between">
                <p className="text-primary">Qualification:</p>
                <p>{section.qualification}</p>
              </div>
            )}
            {section?.kind === 'EXPERIENCE' && (
              <>
                <div className="flex justify-between">
                  <p className="text-primary">Role:</p>
                  <p>{section.role}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Institution:</p>
                  <p>{section.institution}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Description:</p>
                  <p>{section.description}</p>
                </div>
              </>
            )}
            {section?.kind === 'AWARDS' && (
              <>
                <div className="flex justify-between">
                  <p className="text-primary">Award Name:</p>
                  <p>{section.name}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-primary">Issuing Institution:</p>
                  <p>{section.institution}</p>
                </div>
              </>
            )}
          </div>
        </div>
      ))} */}

      <ApModal
        width={700}
        title={
          modal.type === 'PERSONAL'
            ? 'Update Personal Information'
            : modal.type === 'PROFESSIONAL'
              ? 'Update Professional Information'
              : modal.type === 'EXPERTISE'
                ? 'Update Expertise Information'
                : modal.type === 'ACADEMIC'
                  ? 'Update Academic Information'
                  : modal.type === 'EXPERIENCE'
                    ? 'Update Experience Information'
                  : modal.type === 'QUALIFICATION'
                    ? 'Update Qualification Information'
                    : 'Update Award Information'
        }
        onDimiss={() => setModal({ show: false })}
        show={modal.show}
      >
        {modal.type == 'PERSONAL' && (
          <UpdatePersonalInformation onDissmiss={() => setModal({ show: false })} />
        )}
        {modal.type == 'PROFESSIONAL' && (
          <UpdateProfessionalInformation onDissmiss={() => setModal({ show: false })} />
        )}
        {modal.type == 'EXPERTISE' && (
          <UpdateExpertiseInformation
            data={modal?.data}
            onDissmiss={() => setModal({ show: false })}
          />
        )}
        {modal.type == 'ACADEMIC' && (
          <UpdateAcademicInformation
            data={modal?.data}
            onDissmiss={() => setModal({ show: false })}
          />
        )}
        {modal.type == 'EXPERIENCE' && (
          <UpdateExperienceInformation
            data={modal?.data}
            onDissmiss={() => setModal({ show: false })}
          />
        )}
        {modal.type == 'QUALIFICATION' && (
          <UpdateQualificationInformation
            data={modal?.data}
            onDissmiss={() => setModal({ show: false })}
          />
        )}
        {modal.type == 'AWARDS' && (
          <UpdateAwardInformation
            data={modal?.data}
            onDissmiss={() => setModal({ show: false })}
          />
        )}
      </ApModal>
    </ApBodyContainer>
  );
};
