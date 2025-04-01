import {
  ApMasterSelectInput,
  ApTextInput,
  ApPhoneInput,
  ApButton,
  ApSelectInput
} from '@/components';
import ApDateInput from '@/components/input/DatePicker';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { useProfileState } from '../../context';
import { useOrganizationState } from '@/modules/organization/context';
import { DEFAULT_PAGE_SIZE } from '@/constants';

export default function UpdateProfessionalInformation({ onDissmiss }: any) {
  const { profile, updateProfile, updating } = useProfileState();
  const { fetchOrganization, organizations } = useOrganizationState();

  useEffect(() => {
    fetchOrganization({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, []);

  const handleSubmit = (val: any) => {
    const payload: any = {
      organizationId: val?.organizationId?.value,
      officeNumber: val?.officeNumber,
      designationId: val?.designationId?.value,
      researchClusterIds: val?.researchClusterIds?.map((item: any) => item?.value)
    };

    updateProfile(profile?._id, payload)
    .then(() => {
        onDissmiss()
    })
  };

  return (
    <Formik
      initialValues={{
        organizationId: { label: profile?.organization?.name, value: profile?.organizationId },
        designationId: { label: profile?.designation?.name, value: profile?.designationId },
        officeNumber: profile?.officeNumber,
        researchClusterIds: profile?.researchClusters?.length > 0 ? profile?.researchClusters?.map((item) => ({
          value: item?._id,
          label: item?.name
        })) : ''
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <ApSelectInput
              containerClassName="w-full"
              label="ORGANISATION"
              name="organizationId"
              options={organizations.map((org) => ({
                label: org.name,
                value: org._id
              }))}
              helperText="(Select The Organisation You are Currently Affiliated with)"
            />

            <ApTextInput
              containerClassName="w-full"
              label="OFFICE NUMBER"
              name="officeNumber"
              type="text"
              placeHolder="Input Office Number"
            />

            <ApMasterSelectInput
              masterKey="designation"
              containerClassName="w-full"
              label="DESIGNATION"
              name="designationId"
            />

            <ApMasterSelectInput
              masterKey="research_cluster"
              containerClassName="w-full"
              label="RESEARCH CLUSTER"
              name="researchClusterIds"
              helperText="(Add Multiple Research Cluster by Typing And Pressing Enter)"
              isMulti
            />
          </div>
        </div>

        <div className="flex justify-end mt-5">
          <ApButton loading={updating} title="Update" type="submit" />
        </div>
      </Form>
    </Formik>
  );
}
