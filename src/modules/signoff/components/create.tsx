import React from 'react';
import { ApTextInput, ApButton, ApCheckbox } from '@/components';
import { Formik } from 'formik';
import { useSignoffState } from '../context';
import { ISignoff } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';
import ApDateInput from '@/components/input/DatePicker';

const FormSchema = Yup.object().shape({
  // justification: Yup.string().required('Justification is required'),
  // workplan: Yup.string().required('Workplan is required'),
  // deviationReason: Yup.string().required('Deviation reason is required'),
  // remedialAction: Yup.string().required('Remedial action is required'),
  // duration: Yup.string().required('Duration is required')
});

interface IProps {
  applicationId: string;
  reportId: string;
  signoff: ISignoff;
  onDissmiss: () => void;
}

export const CreateSignoff: React.FC<IProps> = ({
  applicationId,
  signoff,
  onDissmiss,
  reportId
}) => {
  const { saveSignoff, updating } = useSignoffState();
  const { fetchReport, filter } = useReportState();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      reportId,
      applicationId
    };

    saveSignoff(payload, signoff?._id).then((res) => {
      if (res) {
        fetchReport(filter, true);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        proposalTittle: signoff?.proposalTittle || '',
        institutionName: signoff?.institutionName || '',
        institutionAddress: signoff?.institutionAddress || '',
        telephone: signoff?.telephone || '',
        email: signoff?.email || '',
        investigators: signoff?.investigators || '',
        executiveSummary: signoff?.executiveSummary || '',
        projectStatus: signoff?.projectStatus || '',
        projectStatusExplanation: signoff?.projectStatusExplanation || ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue, submitForm }) => (
        <div className="flex flex-col space-y-4">

          <ApTextInput
            type="text"
            name="proposalTittle"
            label="Proposal Tittle"
            placeholder="Enter title"
            containerClassName={'w-full'}
          />


          <ApTextInput
            type="text"
            name="investigators"
            label="Investigators"
            placeholder="Enter investigators"
            containerClassName={'w-full'}
          />


          <div className="grid grid-cols-2 gap-2">
            <ApTextInput
              name="institutionName"
              label="Instiution Name"
              placeholder="Enter institution name"
              containerClassName={'w-full'}
            />

            <ApTextInput
              name="institutionAddress"
              label="Institution Address"
              placeholder="Enter institution address"
              containerClassName={'w-full'}
            />
          </div>


          <div className="grid grid-cols-2 gap-2">
            <ApTextInput
              name="telephone"
              label="Telephone"
              placeholder="Enter phone number"
              containerClassName={'w-full'}
            />

            <ApTextInput
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              containerClassName={'w-full'}
            />
          </div>


          <ApTextInput
            type="textarea"
            name="executiveSummary"
            label="Executive Summary"
            placeholder="Enter executive summary"
            containerClassName={'w-full'}
          />

          <ApTextInput
            name="projectStatus"
            label="Project Status"
            placeholder="Project Status"
            containerClassName={'w-full'}
          />

          <ApTextInput
            type="textarea"
            name="projectStatusExplanation"
            label="Project Status Explanation"
            placeholder="Enter project status explanation"
            containerClassName={'w-full'}
          />

          <ApButton
            title={'Update'}
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
