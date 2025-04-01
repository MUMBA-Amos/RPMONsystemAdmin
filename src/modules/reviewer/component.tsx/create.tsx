import { ApButton, ApSelectInput, ApText, ApTextInput } from '@/components';
import { Formik, FormikProps } from 'formik';
import React, { useEffect } from 'react';
import { useReviewerState } from '../context';
import * as Yup from 'yup';

const FormSchema = Yup.object().shape({
  comment: Yup.string().required('comment field is required'),
  status: Yup.string().required('status selection is required')
});

interface IProps {
  applicationId: any;
  modal?: any;
  onDismiss?: () => void;
}

const CreateReviewers: React.FC<IProps> = ({ applicationId, modal, onDismiss }) => {
  const { saveReviewer, updating, fetchReviewers, filter, reviewers } = useReviewerState();
  console.log({ reviewers });
  useEffect(() => {
    fetchReviewers(filter);
  }, []);

  const handleSubmit = (val: any) => {
    console.log({ val });
    const payload = {
      status: val?.status?.value,
      comment: val?.comment,
      reviewerId: val.reviewer.value,
      applicationId
    };

    saveReviewer({ ...payload }, modal?._id).then((res) => {
      if (res) {
        onDismiss && onDismiss();
      }
    });
  };
  console.log({ modal });
  return (
    <Formik
      initialValues={{
        comment: modal?.comment || '',
        status: modal?.status
          ? {
              label: modal?.status,
              value: modal?.status
            }
          : null,
        reviewer: modal?.reviewer
          ? {
              label: modal?.reviewer?.firstName,
              value: modal?.reviewer?._id
            }
          : null
      }}
      onSubmit={handleSubmit}
      validationSchema={FormSchema}
    >
      {(props: FormikProps<any>) => (
        <div className="flex flex-col gap-4">
          <ApSelectInput
            name="reviewer"
            options={reviewers?.map((reviewer) => ({
              label: reviewer?.reviewer?.firstName,
              value: reviewer?.reviewer?._id
            }))}
          />
          <ApTextInput name="comment" placeholder="Enter Comment" label="Comment" />
          <ApSelectInput
            name="status"
            placeholder="Status"
            label="Status"
            options={[
              { label: 'PENDING', value: 'PENDING' },
              { label: 'IN_PROGRESS', value: 'IN_PROGRESS' },
              { label: 'APPROVE', value: 'APPROVE' },
              { label: 'REJECT', value: 'REJECT' }
            ]}
          />

          <div className="w-full flex justify-end items-center">
            <ApButton
              type="submit"
              title="Submit"
              loading={updating}
              onClick={() => handleSubmit(props.values)}
            />
          </div>
        </div>
      )}
    </Formik>
  );
};

export default CreateReviewers;
