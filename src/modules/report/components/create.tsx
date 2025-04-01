import React from 'react';
import { ApTextInput, ApButton } from '@/components';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { IReport } from '../model';
import { useReportState } from '../context';

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required')
});

interface IProps {
  applicationId: string;
  report: IReport;
  onDissmiss: () => void;
  reportType?: any;
}

export const CreateReport: React.FC<IProps> = ({
  report,
  onDissmiss,
  applicationId,
  reportType
}) => {
  const { saveReport, updating, startFinalReport } = useReportState();
  // console.log({ applicationId });

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      applicationId
    };

    reportType === 'final_report'
      ? startFinalReport({ ...payload }).then((res) => {
          res && onDissmiss();
        })
      : saveReport(report?._id, payload).then((res) => {
          if (res) {
            onDissmiss();
          }
        });
  };

  return (
    <Formik
      initialValues={{
        title: report?.title || '',
        description: report?.description || ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="">
            <ApTextInput
              type="text"
              name="title"
              label="Title"
              placeholder="Title"
              containerClassName={'w-full mb-5'}
            />
            <ApTextInput
              type="textarea"
              name="description"
              placeholder="Description"
              label="Description"
              containerClassName={'w-full'}
            />
          </div>

          <ApButton
            title={report ? 'Update' : 'Create'}
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
