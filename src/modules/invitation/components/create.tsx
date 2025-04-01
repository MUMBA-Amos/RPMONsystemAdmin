import {
  ApTextInput,
  ApButton,
  ApMasterSelectInput,
  ApDateRangePicker,
  ApSelectInput
} from '@/components';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useInviteState } from '../context';
import { IInvite } from '../model';
import * as Yup from 'yup';
import moment from 'moment';
import { useOrganizationState } from '@/modules/organization/context';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useAccessGroupState } from '@/modules/permission/group/context';
import { IAccessGroup } from '@/modules/permission/group/model';
import { IOrganization } from '@/modules/organization/model';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().required('Email is required'),
  organizationId: Yup.object()
    .shape({
      value: Yup.string()
    })
    .required('Organization ID is required'),
  groupId: Yup.object()
    .shape({
      value: Yup.string()
    })
    .required('GroupId ID is required')
});

interface IProps {
  invite: IInvite;
  organizations: IOrganization[];
  accessGroups: IAccessGroup[];
  onDissmiss: () => void;
}

export const CreateInvite: React.FC<IProps> = ({
  invite,
  accessGroups,
  organizations,
  onDissmiss
}) => {
  const { saveInvite, updating } = useInviteState();
  console.log({ accessGroups });
  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      organizationId: values.organizationId.value,
      groupId: values.groupId.value
    };
    saveInvite(invite?._id, payload).then((res) => {
      if (res) {
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        name: invite?.name || '',
        email: invite?.email || '',
        organizationId: invite?.organizationId
          ? { label: invite?.organization?.name, value: invite?.organization?._id }
          : { label: '', value: '' },
        groupId: invite?.groupId
          ? { label: invite?.group?.group, value: invite?.group?._id }
          : { label: '', value: '' }
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="name"
              label=" Name"
              placeholder="Name"
              containerClassName={'w-full'}
            />
            <ApTextInput
              type="text"
              name="email"
              placeholder="Email"
              label="Email"
              containerClassName={'w-full'}
            />
          </div>
          <div className="flex gap-4">
            <ApSelectInput
              label="Organization"
              name="organizationId"
              containerClassName="w-full"
              options={organizations.map((org) => ({
                label: org.name,
                value: org._id
              }))}
            />
            <ApSelectInput
              label="Group"
              name="groupId"
              containerClassName="w-full"
              options={accessGroups.map((group) => ({
                label: group.group,
                value: group._id
              }))}
            />
          </div>

          <ApButton
            title={invite?._id ? 'Update' : 'Create'}
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
