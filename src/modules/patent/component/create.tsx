import { ApButton, ApTextInput } from '@/components';
import { Formik } from 'formik';

import React, { useState } from 'react';
import * as Yup from 'yup';

import ApDateInput from '@/components/input/DatePicker';

const FormSchema = Yup.object().shape({
  patentNo: Yup.string().required('Patent No is required'),
  type: Yup.string().required('Patent Type is required'),
  issueDate: Yup.number().required('Issue Date is required'),
  description: Yup.number().required('description is required'),
  inventors: Yup.number().required('Inventors is required')
});

interface IProps {
  patent: any;
  onDissmiss: () => void;
}

export const CreateFinalReportPatent: React.FC<IProps> = ({ patent, onDissmiss }) => {
  const handleSubmit = (values: any) => {
    console.log({ values });
  };

  return (
    <>
      <Formik
        initialValues={{
          patentNo: patent?.patentNo || '',
          type: patent?.type || '',
          issueDate: patent?.issueDate || '',
          description: patent?.description || '',
          inventors: patent?.inventors || ''
        }}
        // validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              <ApTextInput
                type="text"
                name="patentNo"
                label="Patent No"
                placeholder="Patent No"
                containerClassName={'w-full'}
              />
              <ApTextInput
                type="text"
                name="type"
                label="Type"
                placeholder="Type"
                containerClassName={'w-full'}
              />
            </div>
            <div className="flex items-center gap-4">
              <ApDateInput
                label="Issue Date"
                name="issueDate"
                placeholder="Issue Date"
                containerClassName={'w-full'}
              />

              <ApTextInput
                type="text"
                name="description"
                label="Description"
                placeholder="Description"
                containerClassName={'w-full'}
              />
            </div>
            <div className="flex items-center gap-4">
              <ApTextInput
                type="text"
                name="inventors"
                label="Inventors"
                placeholder="Inventors"
                containerClassName={'w-full'}
              />
            </div>

            <ApButton
              title={patent?._id ? 'Update' : 'Create'}
              type="submit"
              onClick={submitForm}
              //   loading={updating}
              //   disabled={updating}
            />
          </div>
        )}
      </Formik>
    </>
  );
};
