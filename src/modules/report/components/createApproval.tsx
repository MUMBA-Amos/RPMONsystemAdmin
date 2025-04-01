import React from 'react';
import { ApTextInput, ApButton, ApCheckbox } from '@/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';
import ApDateInput from '@/components/input/DatePicker';

const FormSchema = Yup.object().shape({
  user: Yup.string().required('User is required'),
  decision: Yup.string().required('Decision is required'),
  comment: Yup.string().required('Comment is required'),
  revision: Yup.string().required('Revision is required')
});

interface IProps {
  reportId?: string;
  approver: any;
  onDissmiss: () => void;
}

export const CreateApprover: React.FC<IProps> = ({ approver, onDissmiss, reportId }) => {
  const handleSubmit = (values: any) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={{
        user: approver?.user || '',
        decision: approver?.decision || '',
        comment: approver?.comment || '',
        date: approver?.comment || 0,
        revision: approver?.revision || ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="user"
              label="User"
              placeholder="Enter User"
              containerClassName={'w-full'}
            />
          </div>

          <ApTextInput
            type="text"
            name="decision"
            label="Decision"
            placeholder="Enter Decision"
            containerClassName={'w-full'}
          />
          <ApDateInput name="date" label="Date" placeholder="Date" containerClassName={'w-full'} />
          <ApTextInput
            type="text"
            name="revision"
            label="Revision"
            placeholder="Enter Revision"
            containerClassName={'w-full'}
          />
          <ApTextInput
            type="textarea"
            name="comment"
            label="Comment"
            placeholder="Enter Comment"
            containerClassName={'w-full'}
          />

          <ApButton title={'Update'} type="submit" onClick={submitForm} />
        </div>
      )}
    </Formik>
  );
};
