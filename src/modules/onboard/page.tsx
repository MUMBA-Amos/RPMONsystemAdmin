import React, { useState } from 'react';
import { ApSegment } from '@/components';
import Image from 'next/image';
import { Formik, Form } from 'formik';
import { useRouter } from 'next/router';
import { PersonalDetails } from './create/personal-info';
import {
  AcademicSchema,
  AwardsSchema,
  ContactSchema,
  ExperienceSchema,
  ExpertiseSchema,
  PersonalInfoSchema,
  ProfessionalInfoSchema,
  QualificationSchema,
  SectionSchema
} from './validation';
import { ProfessionalDetails } from './create/professional';
import { SectionDetails } from './create/section';
import { useProfileState } from '../profile/context';
import Logo from '../../assets/srdc_logo.png';
import { ContractDetails } from './create/contract';
import { AcademicDetails } from './create/academic';
import { ExperienceDetails } from './create/experience';
import { QualificationDetails } from './create/qualification';
import { AwardsDetails } from './create/awards';
import { ExpertiseDetails } from './create/expertise';

let TABS:
  | 'personalInfo'
  | 'professional'
  | 'CONTRACT'
  | 'QUALIFICATION'
  | 'EXPERIENCE'
  | 'AWARDS'
  | 'ACADEMIC'
  | 'EXPERTISE';

const allTabs = [
  { key: 'personalInfo', label: 'Personal Information', component: PersonalDetails },
  { key: 'professional', label: 'Professional Information', component: ProfessionalDetails },
  { key: 'CONTRACT', label: 'Contract Information', component: ContractDetails },
  {
    key: 'ACADEMIC',
    label: 'Academic Info',
    component: AcademicDetails
  },
  {
    key: 'EXPERIENCE',
    label: 'Work Experience',
    component: ExperienceDetails
  },
  {
    key: 'QUALIFICATION',
    label: ' Qualifications',
    component: QualificationDetails
  },
  {
    key: 'AWARDS',
    label: 'Awards',
    component: AwardsDetails
  },
  {
    key: 'EXPERTISE',
    label: 'Expertise',
    component: ExpertiseDetails
  }
];

interface IProps {
  invitationId: string;
  inviteSections: string[];
}
export const RegistrationPage: React.FC<IProps> = ({ invitationId, inviteSections }) => {
  const segmentRef = React.useRef(null);
  const { createProfile, updating } = useProfileState();

  const [nextPage, setNextPage] = useState<{
    show: boolean;
    type?: typeof TABS;
  }>({ show: false, type: 'personalInfo' });
  const router = useRouter();

  const handleNext = (currentTab: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.key === currentTab);
    if (currentIndex < tabs.length - 1) {
      setNextPage({ ...nextPage, type: tabs[currentIndex + 1].key as typeof TABS });
    }
  };

  const handleBack = (currentTab: string) => {
    const currentIndex = tabs.findIndex((tab) => tab.key === currentTab);
    if (currentIndex > 0) {
      setNextPage({ ...nextPage, type: tabs[currentIndex - 1].key as typeof TABS });
    }
  };

  const tabs = [
    { key: 'personalInfo', label: 'Personal Information', component: PersonalDetails },
    { key: 'professional', label: 'Professional Information', component: ProfessionalDetails },
    ...allTabs.filter((tab) => inviteSections?.includes(tab.key))
  ];

  const handleSubmit = (values: any) => {
    if (nextPage.type === 'CONTRACT') {
      let payload: any = {
        user: {
          titleId: values?.user?.titleId?.value,
          nationalityId: values?.user?.nationalityId?.value,
          idNumber: values?.user?.idNumber,
          idTypeId: values?.user?.idTypeId?.value,
          genderId: values?.user?.genderId?.value,
          firstName: values?.user?.firstName,
          lastName: values?.user?.lastName,
          email: values?.user?.email,
          phoneNumber: values?.user?.phoneNumber,
          password: values?.user?.password,
          dateOfBirth: values?.user?.dateOfBirth
        },
        sections: values?.sections,
        invitationId,
        organizationId: values?.organizationId?.value,
        residenceStatusId: values?.residenceStatusId?.value,
        designationId: values?.designationId?.value,
        officeNumber: values?.officeNumber,
        researchClusterIds: values?.researchClusterIds?.map((item: any) => item?.value)
      };

      if (inviteSections?.includes('CONTRACT')) {
        payload = {
          ...payload,
          sections: [
            ...payload?.sections,
            {
              name: values?.contract?.name,
              contractTypeId: values?.contract?.contractTypeId.value,
              kind: 'CONTRACT',
              fromDate: values?.contract?.duration?.fromDate,
              toDate: values?.contract?.duration?.toDate
            }
          ]
        };
      }

      createProfile(payload).then((res) => {
        if (res) {
          router.push('/login');
        }
      });
    } else {
      handleNext(nextPage.type as any);
    }
  };

  const getValidationSchema = (tab: typeof TABS) => {
    switch (tab) {
      case 'personalInfo':
        return PersonalInfoSchema;
      case 'professional':
        return ProfessionalInfoSchema;
      case 'CONTRACT':
        return ContactSchema;
      case 'ACADEMIC':
        return AcademicSchema;
      case 'EXPERIENCE':
        return ExperienceSchema;
      case 'QUALIFICATION':
        return QualificationSchema;
      case 'AWARDS':
        return AwardsSchema;
      case 'EXPERTISE':
        return ExpertiseSchema;
      default:
        return null;
    }
  };
  console.log({ tabKeys: tabs });
  return (
    <div className="flex flex-col justify-center items-center gap-4 pt-4 px-8">
      <Image src={Logo} alt="logo" width={50} height={50} />
      <p className="text-center  text-lg">USER ONBOARDING</p>
      <div className="w-full flex gap-4 md:h-full">
        <div className={'w-full md:h-full'}>
          <Formik
            initialValues={{
              user: {
                titleId: { label: '', value: '' },
                genderId: { label: '', value: '' },
                nationalityId: { label: '', value: '' },
                idTypeId: { label: '', value: '' },
                idNumber: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                email: '',
                password: '',
                phoneNumber: ''
              },
              officeNumber: '',
              residenceStatusId: '',
              organizationId: '',
              designationId: '',
              service: '',
              contractTypeId: '',
              researchClusterIds: [],
              sections: []
            }}
            validationSchema={() => getValidationSchema(nextPage?.type as typeof TABS)}
            // validationSchema={
            //   nextPage?.type == 'personalInfo'
            //     ? PersonalInfoSchema
            //     : nextPage?.type == 'professional'
            //       ? ProfessionalInfoSchema
            //       : nextPage?.type == 'CONTRACT'
            //         ? ContactSchema
            //         : nextPage?.type == 'ACADEMIC'
            //           ? AcademicSchema
            //           : nextPage?.type == 'EXPERIENCE'
            //             ? ExperienceSchema
            //             : nextPage?.type == 'QUALIFICATION'
            //               ? QualificationSchema
            //               : nextPage?.type == 'AWARDS'
            //                 ? AwardsSchema
            //                 : nextPage?.type == 'EXPERTISE'
            //                   ? ExpertiseSchema
            //                   : null
            // }
            onSubmit={handleSubmit}
          >
            {({ submitForm, values, setFieldValue }) => (
              <Form className="w-full Form card md:p-2">
                {
                  <ApSegment
                    items={tabs.map((tab) => ({
                      key: tab.key,
                      label: tab.label,
                      children: (props: any) => {
                        const Component = tab.component;
                        console.log(tab.label);
                        return (
                          <div className="border border-primary rounded-md p-6">
                            <Component
                              {...props}
                              loading={updating}
                              setFieldValue={setFieldValue}
                              formValues={values}
                              sectionType={tab.key}
                              onBack={() => handleBack(tab.key)}
                              onNext={() => {
                                submitForm();
                                tab.key === 'AWARDS' ? submitForm() : handleNext(tab.key);
                              }}
                            />
                          </div>
                        );
                      }
                    }))}
                    ref={segmentRef}
                    activeKey={nextPage.type}
                    onSelect={(index) =>
                      setNextPage({ show: true, type: tabs[index].key as typeof TABS })
                    }
                  />
                }
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};
