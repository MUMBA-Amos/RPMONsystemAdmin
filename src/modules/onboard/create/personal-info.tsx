import { useFormikContext } from 'formik';
import { PersonalInfoSchema } from '../validation';
import {
  ApButton,
  ApMasterSelectInput,
  ApPhoneInput,
  ApSelectInput,
  ApTextInput
} from '@/components';
import ApDateInput from '@/components/input/DatePicker';
import { BsFillArrowRightCircleFill } from 'react-icons/bs';
import React from 'react';

interface IProps {
  onBack: () => void;
  onNext: () => void;
}

export const PersonalDetails: React.FC<IProps> = ({ onNext, onBack }) => {
  const handleNext = async () => {
    onNext();
  };

  return (
    <div className="h-full w-full flex flex-col justify-between">
      <div>
        <h2 className="text-xl text-center font-semibold mb-5 leading-10 text-primary">PERSONAL</h2>
        <div className="grid grid-cols-2 gap-4">
          <ApMasterSelectInput
            // value={values.user.titleId}
            label="Salutation"
            masterKey={'title'}
            name="user.titleId"
          />
          <ApMasterSelectInput
            // value={values.user.genderId}
            label="Gender"
            masterKey="gender"
            name="user.genderId"
          />
          <div className="col-span-2">
            <ApMasterSelectInput
              // value={values.user.nationalityId}
              masterKey="nationality"
              label="Race"
              name="user.nationalityId"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <ApTextInput label="First Name" name="user.firstName" />
            <ApTextInput label="Last Name" name="user.lastName" />
          </div>
          <div className="grid grid-cols-2 gap-4 col-span-2">
            <ApTextInput label="Email" name="user.email" />
            <ApTextInput type="password" label="Password" name="user.password" />
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-3">Identity Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <ApMasterSelectInput
            masterKey="identity_type"
            label="Identity Type"
            name="user.idTypeId"
            placeholder="Select Identity Type"
          />
          <ApTextInput
            label="Identity Number"
            name="user.idNumber"
            placeholder="Enter Identity No."
          />
          <div className="col-span-2">
            <ApDateInput label="Date of Birth" name="user.dateOfBirth" placeholder="DD/MM/YYYY" />
          </div>
        </div>

        <h2 className="text-lg font-semibold mt-6 mb-3">Contact Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <ApMasterSelectInput
            masterKey="residential_status"
            label="Residence Status"
            name="residenceStatusId"
            placeholder="Select Residence Status"
          />
          <ApPhoneInput label="Phone Number" name="user.phoneNumber" />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <ApButton type="button" onClick={onBack} btnType="outline">
          Back
        </ApButton>
        <ApButton type="button" onClick={handleNext} btnType="primary">
          Next <BsFillArrowRightCircleFill className="ml-2" />
        </ApButton>
      </div>
    </div>
  );
};
