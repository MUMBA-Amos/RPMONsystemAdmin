import React from 'react';
import { ApTextInput, ApButton, ApCheckbox, ApSelectInput } from '@/components';
import { Formik } from 'formik';
import { useExtenstionState } from '../context';
import { IExtenstion } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';

const FormSchema = Yup.object().shape({
  justification: Yup.string().required('Justification is required'),
  workplan: Yup.string().required('Workplan is required'),
  deviationReason: Yup.string().required('Deviation reason is required'),
  remedialAction: Yup.string().required('Remedial action is required'),
  duration: Yup.string().required('Duration is required'),
  report: Yup.object().shape({
    _id: Yup.string().required('Report is required')
  })
});

interface IProps {
  reportId?: string;
  applicationId: string;
  extenstion?: IExtenstion;
  onDissmiss: () => void;
}

export const CreateExtenstion: React.FC<IProps> = ({ extenstion, onDissmiss, applicationId, reportId }) => {
  const { saveExtenstion, updating } = useExtenstionState();
  const { fetchReport, reports, filter } = useReportState();
  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      applicationId,
      reportId: values.report._id
    };

    delete payload.report;

    saveExtenstion(payload, extenstion?._id).then((res) => {
      if (res) {
        fetchReport(filter, true);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        hasExtenstion: extenstion?.hasExtenstion || false,
        duration: extenstion?.duration || '',
        justification: extenstion?.justification || '',
        workplan: extenstion?.workplan || '',
        deviationReason: extenstion?.deviationReason || '',
        remedialAction: extenstion?.remedialAction || '',
        report: reports.find((report) => report._id === extenstion?.reportId) || reports[0]
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        <div className="flex flex-col space-y-4">

          <div className="grid grid-cols-2 gap-4">
            <ApTextInput
              type="text"
              name="duration"
              label="Duration"
              placeholder="Enter duration"
              containerClassName={'w-full'}
            />

            <ApSelectInput label='Report' name={'report'} options={reports} valueKey='_id' labelKey='title' />
          </div>

          <ApTextInput
            type="textarea"
            name="justification"
            label="Justification"
            placeholder="Enter justification"
            containerClassName={'w-full'}
          />

          <ApTextInput
            type="textarea"
            name="workplan"
            label="Workplan"
            placeholder="Enter workplan"
            containerClassName={'w-full'}
          />
          <ApTextInput
            type="textarea"
            name="deviationReason"
            label="Deviation Reason"
            placeholder="Enter deviation reason"
            containerClassName={'w-full'}
          />

          <ApTextInput
            type="textarea"
            name="remedialAction"
            label="Remedial Action"
            placeholder="Enter remedial action"
            containerClassName={'w-full'}
          />


          <ApButton
            title={extenstion?._id ? 'Update' : 'Create'}
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
