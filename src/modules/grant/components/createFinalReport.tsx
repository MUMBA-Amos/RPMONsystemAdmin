import { ApButton, ApTextInput } from '@/components';
import { Formik } from 'formik';

import React, { useState } from 'react';
import * as Yup from 'yup';
import { useGrantState } from '../context';

import ApDateInput from '@/components/input/DatePicker';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Grant Name is required'),
  maximumBudget: Yup.string().required('Grant maximum Budget is required'),
  refrenceCode: Yup.number().required('Grant Reference Code is required'),
  researchFocus: Yup.number().required('Grant Research Focus is required'),
  proposalTitle: Yup.number().required('Grant Proposal Title is required')
});

interface IProps {
  grant: any;
  onDissmiss: () => void;
}

export const CreateFinalGrant: React.FC<IProps> = ({ grant, onDissmiss }) => {
  const { saveGrant, modal, setModal, updating } = useGrantState();

  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  return (
    <>
      <Formik
        initialValues={{
          name: grant?.name || '',
          maximumBudget: grant?.maximumBudget || '',
          refrenceCode: grant?.refrenceCode || '',
          researchFocus: grant?.researchFocus || '',
          proposalTitle: grant?.proposalTitle || ''
        }}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput
                type="text"
                name="name"
                label="title"
                placeholder="Title"
                containerClassName={'w-full'}
              />
              <ApTextInput
                type="text"
                name="maximumBudget"
                label="Maximum Budget"
                placeholder="Journal"
                containerClassName={'w-full'}
              />
            </div>
            <div className="flex gap-4">
              <ApDateInput
                label="Maximum Duration"
                name="maximumDuration"
                placeholder="Maximum Duration"
                containerClassName={'w-full'}
              />

              <ApDateInput
                name="refrenceCode"
                label="Reference Code"
                placeholder="Reference Code"
                containerClassName={'w-full'}
              />
            </div>
            <div className="flex gap-4">
              <ApTextInput
                type="text"
                name="researchFocus"
                label="Research Focus"
                placeholder="Research Focus"
                containerClassName={'w-full'}
              />
              <ApTextInput
                type="text"
                name="proposalTitle"
                label="Proposal Title"
                placeholder="Proposal Title"
                containerClassName={'w-full'}
              />
            </div>

            <ApButton
              title={grant?._id ? 'Update' : 'Create'}
              type="submit"
              onClick={submitForm}
              loading={updating}
              disabled={updating}
            />
          </div>
        )}
      </Formik>
    </>
  );
};
