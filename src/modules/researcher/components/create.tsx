import React, { useEffect } from 'react';
import {
  ApTextInput,
  ApButton,
  ApCheckbox,
  ApMasterSelectInput,
  ApSelectInput
} from '@/components';
import { Formik } from 'formik';
import { useResearcherState } from '../context';
import { IResearcher, StudyStatus } from '../model';
import * as Yup from 'yup';
import { useReportState } from '@/modules/report/context';
import { useUserState } from '@/modules/user/context';

const FormSchema = Yup.object().shape({});

interface IProps {
  reportId: string;
  researcher: IResearcher;
  onDissmiss: () => void;
}

export const CreateResearcher: React.FC<IProps> = ({ reportId, researcher, onDissmiss }) => {
  const { saveResearcher, updating } = useResearcherState();
  const { fetchReport, filter } = useReportState();
  const { fetchUsers, loading, users } = useUserState();

  useEffect(() => {
    fetchUsers({ page: 1, pageSize: 500 });
  }, []);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      studyStatus: values?.studyStatus?.value,
      reportId,
      supervisorId: values?.supervisor?.value
    };

    delete payload?.supervisor;

    saveResearcher(payload, researcher?._id).then((res) => {
      if (res) {
        fetchReport(filter, true);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        firstName: researcher?.firstName || '',
        lastName: researcher?.lastName || '',
        studyLevel: researcher?.studyLevel || '',
        nationality: researcher?.nationality || '',
        studyStatus: researcher?.studyStatus
          ? {
            value: researcher?.studyStatus,
            label: researcher?.studyStatus
          }
          : '',
        isStudent: researcher?.isStudent || false,
        supervisor: researcher?.supervisorId
          ? {
            value: users?.filter((item) => item?._id == researcher?.supervisorId)[0]?._id,
            label: `${users?.filter((item) => item?._id == researcher?.supervisorId)[0]?.firstName} ${users?.filter((item) => item?._id == researcher?.supervisorId)[0]?.lastName}`
          }
          : ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ values, submitForm, setFieldValue }) => (
        <div className="flex flex-col space-y-5">
          <ApSelectInput
            options={users?.map((item: any) => ({
              value: item?._id,
              label: `${item?.firstName} ${item?.lastName}`
            }))}
            isLoading={loading}
            label="Supervisor"
            name="supervisor"
            placeholder="Select Supervisor"
          />

          <div className="grid grid-cols-2 gap-5">
            <ApTextInput label="First Name" name="firstName" placeHolder="Enter first name" />
            <ApTextInput label="Last Name" name="lastName" placeHolder="Enter last name" />
          </div>


          <ApTextInput label="Study Level" name="studyLevel" placeHolder="Enter study level" />

          <div className="grid grid-cols-2 gap-5">
            <ApTextInput label="Nationality" name="nationality" placeHolder="Enter nationality" />

            <ApSelectInput
              options={[
                { value: StudyStatus.GRADUATE, label: StudyStatus.GRADUATE },
                { value: StudyStatus.ONGOING, label: StudyStatus.ONGOING }
              ]}
              label="Study Status"
              name="studyStatus"
              placeholder="Select study status"
            />
          </div>

          <ApButton
            title={researcher?._id ? 'Update' : 'Create'}
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
