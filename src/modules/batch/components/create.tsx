import React from 'react';
import { ApTextInput, ApButton } from '@/components';
import { Formik } from 'formik';
import { useBatchState } from '../context';
import { IBatch } from '../model';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required')
});

interface IProps {
  batch: IBatch;
  onDissmiss: () => void;
}

export const CreateBatch: React.FC<IProps> = ({ batch, onDissmiss }) => {
  const { saveBatch, updating } = useBatchState();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values
    };
    saveBatch(batch?._id, payload).then((res) => {
      if (res) {
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        name: batch?.name || '',
        description: batch?.description || ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="name"
              label=" Name"
              placeholder="Name"
              containerClassName={'w-full'}
            />
            <ApTextInput
              type="text"
              name="description"
              placeholder="Description"
              label="Description"
              containerClassName={'w-full'}
            />
          </div>

          <ApButton
            title={batch?._id ? 'Update' : 'Create'}
            type="submit"
            onClick={submitForm}
            loading={updating}
            disabled={updating}
          />
        </div>
      )}
    </Formik>
  );
};
