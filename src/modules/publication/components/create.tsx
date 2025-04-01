import React from 'react';
import { ApTextInput, ApButton, ApCheckbox, ApMasterSelectInput } from '@/components';
import { Formik } from 'formik';
import { usePublicationState } from '../context';
import { IPublication } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';
import { useApplicationState } from '@/modules/application/context';

const FormSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  status: Yup.string().required('Status is required'),
  year: Yup.string().required('Year is required'),
  doi: Yup.string().required('DOI is required'),
  url: Yup.string().required('DOI is required'),
  submittedTo: Yup.string().required('Submitted To is required'),
});

interface IProps {
  reportId: string
  applicationId: string;
  publication: IPublication;
  onDissmiss: () => void;
}

export const CreatePublication: React.FC<IProps> = ({ reportId, publication, onDissmiss, applicationId }) => {
  const { savePublication, updating } = usePublicationState();
  const { fetchApplication } = useApplicationState();
  const { filter } = useReportState()

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      paperTypeId: values?.paperType?.value,
      year: parseInt(values?.year),
      tierId: values?.publicationTier?.value,
      applicationId,
      reportId
    };

    delete payload?.paperType;

    delete payload?.publicationTier;

    savePublication(payload, publication?._id).then((res) => {
      if (res) {
        fetchApplication(applicationId);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        title: publication?.title || '',
        status: publication?.status || '',
        year: publication?.year || '',
        doi: publication?.doi || '',
        url: publication?.url || '',
        submittedTo: publication?.submittedTo || '',
        publicationTier: {
          value: publication?.paperType?._id || '',
          label: publication?.paperType?.name || ''
        },
        paperType: publication?.paperType
          ? { value: publication?.paperType?._id, label: publication?.paperType?.name }
          : ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <ApTextInput label="Title" name="title" placeHolder="Title" />
            <ApMasterSelectInput
              label="Tier"
              masterKey="publication_tier"
              name="publicationTier"
              placeholder="Tier"
              containerClassName={'w-full'}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ApTextInput label="Status" name="status" placeHolder="Status" />
            <ApMasterSelectInput
              label="Paper Type"
              masterKey="paper_type"
              name="paperType"
              placeholder="Paper Type"
              containerClassName={'w-full'}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ApTextInput
              label="Publication Year"
              name="year"
              placeHolder="Publication Year"
              type="number"
            />
            <ApTextInput label="DOI" name="doi" placeHolder="DOI" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <ApTextInput label="Article URL" name="url" placeHolder="Article URL..." />
            <ApTextInput label="Submitted To" name="submittedTo" placeHolder="Submitted To" />
          </div>

          <ApButton
            title={publication?._id ? 'Update' : 'Create'}
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
