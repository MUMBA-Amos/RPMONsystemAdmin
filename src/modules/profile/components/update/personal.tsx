import { ApMasterSelectInput, ApTextInput, ApPhoneInput, ApButton } from '@/components';
import ApDateInput from '@/components/input/DatePicker';
import { Form, Formik } from 'formik';
import React from 'react';
import { useProfileState } from '../../context';

export default function UpdatePersonalInformation({ onDissmiss }: any) {
  const { profile, updateProfile, updating } = useProfileState();

  const handleSubmit = (val: any) => {

    console.log('val', val);


    const payload: any = {
      user: {
        titleId: val?.titleId?.value,
        genderId: val?.genderId?.value,
        nationalityId: val?.nationalityId?.value,
        idTypeId: val?.idTypeId?.value,
        idNumber: val?.idNumber,
        firstName: val?.firstName,
        lastName: val?.lastName,
        email: val?.email,
        phoneNumber: val?.phoneNumber,
        dateOfBirth: val?.dateOfBirth
      },
      residenceStatusId: val?.residenceStatusId?.value
    };

    updateProfile(profile?._id, payload).then(() => {
      onDissmiss();
    });
  };

  return (
    <Formik
      initialValues={{
        titleId: { label: profile?.user?.title?.name || '', value: profile?.user?.titleId || '' },
        genderId: { label: profile?.user?.gender?.name || '', value: profile?.user?.genderId || '' },
        nationalityId: {
          label: profile?.user?.nationality?.name || '',
          value: profile?.user?.nationalityId || ''
        },
        idTypeId: profile?.user?.idType
          ? { label: profile?.user?.idType?.name, value: profile?.user?.idType?._id }
          : { label: '', value: '' },
        idNumber: profile?.user?.idNumber || '',
        firstName: profile?.user?.firstName || '',
        lastName: profile?.user?.lastName || '',
        dateOfBirth: profile?.user?.dateOfBirth || '',
        email: profile?.user?.email || '',
        phoneNumber: profile?.user?.phoneNumber || '',
        residenceStatusId: { label: profile?.residenceStatus?.name || '', value: profile?.residenceStatusId || '' },
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <ApMasterSelectInput label="Salutation" masterKey={'title'} name="titleId" />
            <ApMasterSelectInput label="Gender" masterKey="gender" name="genderId" />
            <div className="col-span-2">
              <ApMasterSelectInput masterKey="nationality" label="Race" name="nationalityId" />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <ApTextInput label="First Name" name="firstName" />
              <ApTextInput label="Last Name" name="lastName" />
            </div>
            <div className="grid grid-cols-2 gap-4 col-span-2">
              <ApTextInput label="Email" name="email" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <ApMasterSelectInput
              masterKey="identity_type"
              label="Identity Type"
              name="idTypeId"
              placeholder="Select Identity Type"
            />
            <ApTextInput label="Identity Number" name="idNumber" placeholder="Enter Identity No." />
            <div className="col-span-2">
              <ApDateInput label="Date of Birth" name="dateOfBirth" placeholder="DD/MM/YYYY" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-5">
            <ApMasterSelectInput
              masterKey="residential_status"
              label="Residence Status"
              name="residenceStatusId"
              placeholder="Select Residence Status"
            />
            <ApPhoneInput label="Phone Number" name="phoneNumber" />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <ApButton loading={updating} title="Update" type="submit" />
        </div>
      </Form>
    </Formik>
  );
}
