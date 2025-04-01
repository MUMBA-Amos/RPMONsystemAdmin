import React from 'react';
import { ApTextInput, ApButton } from '@/components';
import { Formik } from 'formik';
import { useResearchState } from '../context';
import { IResearch } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';

const FormSchema = Yup.object().shape({
  version: Yup.string().required('Version is required'),
  overview: Yup.string().required('Overview is required'),
  methodology: Yup.string().required('Methodology is required'),
  results: Yup.string().required('Results is required'),
  duration: Yup.string().required('Duration is required'),
  explanation: Yup.string().required('Explanation is required')
});

interface IProps {
  applicationId: string;
  reportId: string;
  research: IResearch;
  onDissmiss: () => void;
}

export const CreateResearch: React.FC<IProps> = ({
  reportId,
  research,
  onDissmiss,
  applicationId
}) => {
  const { saveResearch, updating } = useResearchState();
  const { fetchReport, filter } = useReportState();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      applicationId,
      reportId
    };

    saveResearch(payload, research?._id).then((res) => {
      if (res) {
        fetchReport(filter, true);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        version: research?.version || '',
        overview: research?.overview || '',
        methodology: research?.methodology || '',
        results: research?.results || '',
        deviationExplanation: research?.deviationExplanation || '',
        remedialAction: research?.remedialAction || '',
        requestExtention: research?.requestExtention || '',
        duration: research?.duration || '',
        explanation: research?.explanation || ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="version"
              label="Version"
              placeholder="Enter version"
              containerClassName={'w-full'}
            />

            <ApTextInput
              type="text"
              name="duration"
              label="Duration"
              placeholder="Enter duration"
              containerClassName={'w-full'}
            />
          </div>
          
          <ApTextInput
            type="textarea"
            name="overview"
            label="Overview"
            placeholder="Enter overview"
            containerClassName={'w-full'}
          />

          <ApTextInput
            type="textarea"
            name="methodology"
            label="Methodology"
            placeholder="Enter methodology"
            containerClassName={'w-full'}
          />
          <ApTextInput
            type="textarea"
            name="results"
            label="Results"
            placeholder="Enter results"
            containerClassName={'w-full'}
          />

          {/* <ApTextInput
            type="textarea"
            name="deviationExplanation"
            label="Deviation Explanation"
            placeholder="Enter deviation explanation"
            containerClassName={'w-full'}
          /> */}

          {/* <ApTextInput
            type="textarea"
            name="remedialAction"
            label="Remedial Action"
            placeholder="Enter remedial action"
            containerClassName={'w-full'}
          /> */}
          {/* <ApTextInput
            type="textarea"
            name="requestExtention"
            label="Request Extention"
            placeholder="Enter request extention"
            containerClassName={'w-full'}
          /> */}

          <ApTextInput
            type="textarea"
            name="explanation"
            label="Explanation"
            placeholder="Enter explanation"
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
