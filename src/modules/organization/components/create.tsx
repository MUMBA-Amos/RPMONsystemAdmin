import { ApButton, ApPhoneInput, ApTextInput } from '@/components';
import { Formik } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import { useOrganizationState } from '../context';
import { IOrganization } from '../model';

const FormSchema = Yup.object().shape({
  name: Yup.string().required('Organization Name is required'),
  email: Yup.string(),
  phone: Yup.string(),
  address: Yup.string()
});

interface IProps {
  organization: IOrganization;
  onDissmiss: () => void;
}

export const CreateOrganization: React.FC<IProps> = ({ organization, onDissmiss }) => {
  const { saveOrganization, updating } = useOrganizationState();

  const handleSubmit = (values: any) => {
    const payload = {
      ...values
    };

    saveOrganization(organization?._id, payload).then((res) => {
      if (res) {
        onDissmiss();
      }
    });
  };

  return (
    <>
      <Formik
        initialValues={{
          name: organization?.name || '',
          email: organization?.email || '',
          phone: organization?.phone || ''
        }}
        validationSchema={FormSchema}
        onSubmit={handleSubmit}
      >
        {({ submitForm }) => (
          <div className="flex flex-col space-y-4">
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput
                type="text"
                name="name"
                label="Organization Name"
                placeholder="Organization Name"
                containerClassName={'w-full'}
              />

              <ApTextInput
                type="text"
                name="email"
                label="Organization Email"
                placeholder="Organization Email"
                containerClassName={'w-full'}
              />
            </div>
            <div className="grid grid-cols-1 gap-5">
              <ApPhoneInput
                name="phone"
                label="Organization Phone"
                placeholder="Organization Phone"
                containerClassName={'w-full'}
              />

              <ApTextInput
                type="textarea"
                name="address"
                label="Organization Address"
                placeholder="Organization addres"
                containerClassName={'w-full'}
              />
            </div>

            <ApButton
              title={organization?._id ? 'Update' : 'Create'}
              type="submit"
              onClick={submitForm}
              loading={updating}
              disabled={updating}
            />
          </div>
        )}
      </Formik>
    </>
  );
};
