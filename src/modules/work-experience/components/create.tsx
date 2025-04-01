import React, { useEffect } from 'react';
import {
  ApTextInput,
  ApButton,
  ApSelectInput
} from '@/components';
import { Formik } from 'formik';
import { useWorkExperienceState } from '../context';
import { IWorkExperience } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';
import { useOrganizationState } from '@/modules/organization/context';

const FormSchema = Yup.object().shape({

});

interface IProps {
  reportId: string;
  researcherId: string;
  workExperience: IWorkExperience;
  onDissmiss: () => void;
}

export const CreateWorkExperience: React.FC<IProps> = ({
  reportId,
  workExperience,
  onDissmiss,
  researcherId
}) => {
  const { saveWorkExperience, updating } = useWorkExperienceState();
  const { fetchReport, filter } = useReportState();
  const { fetchOrganization, organizations, filter: organizationFilter } = useOrganizationState();

  useEffect(() => {
    fetchOrganization(organizationFilter);
  }, [organizationFilter]);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      reportId,
      researcherId,
      institutionId: values?.institution?.value,
      institutionName: values?.institution?.label
    };

    delete payload?.institution;

    saveWorkExperience(payload, workExperience?._id).then((res) => {
      if (res) {
        fetchReport(filter, true);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        role: workExperience?.role || '',
        description: workExperience?.description || '',
        institution: workExperience?.institutionId
          ? {
              value: workExperience?.institutionId,
              label: workExperience?.institutionName
            }
          : ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-5">
          <ApTextInput label="Role" name="role" placeHolder="Enter role" />

          <ApSelectInput
            options={organizations?.map((item) => ({
              value: item?._id,
              label: item?.name
            }))}
            label="Institution"
            name="institution"
            placeholder="Select institution"
          />

          <ApTextInput
            type="textarea"
            label="Description"
            name="description"
            placeHolder="Enter description"
          />

          <ApButton
            title={workExperience?._id ? 'Update' : 'Create'}
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
