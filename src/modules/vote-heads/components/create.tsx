import React from 'react';
import { ApTextInput, ApButton } from '@/components';
import { Formik } from 'formik';
import { useVoteHeadState } from '../context';
import { IVoteHead } from '../model';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  amount: Yup.number().typeError('Amount must be a number').required('Amount is required')
});

interface IProps {
  voteHead: IVoteHead;
  onDissmiss: () => void;
}

export const CreateVoteHead: React.FC<IProps> = ({ voteHead, onDissmiss }) => {
  const { saveVoteHead, updating } = useVoteHeadState();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      amount: Number(values.amount)
    };
    saveVoteHead(voteHead?._id, payload).then((res) => {
      if (res) {
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        name: voteHead?.name || '',
        description: voteHead?.description || '',
        amount: voteHead?.amount || 0
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
          <div className="flex">
            <ApTextInput
              type="number"
              name="amount"
              placeholder="000"
              label="Amount"
              containerClassName={'w-full'}
            />
          </div>

          <ApButton
            title={voteHead?._id ? 'Update' : 'Create'}
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
