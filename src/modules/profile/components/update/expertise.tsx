import {
  ApTextInput,
  ApButton,
} from '@/components';
import { Form, Formik } from 'formik';
import React from 'react';
import { useProfileState } from '../../context';

export default function UpdateExpertiseInformation({ onDissmiss, data }: any) {
  const { profile, updateProfile, updating } = useProfileState();

  const handleSubmit = (val: any) => {
    const originalIndex = profile?.sections?.findIndex((section) => section === data);
    const sections = profile.sections.map((item, i) => {
      if(i == originalIndex){
        return {
          ...val,
          kind: 'EXPERTISE'
        }
      } else {
        return {
          kind: item?.kind,
          name: item?.name,
          description: item?.description,
          fromDate: item?.fromDate,
          toDate: item?.toDate,
          institution: item?.institution,
          role: item?.role,
          qualification: item?.qualification,
          fieldOfStudy: item?.fieldOfStudy,
          contractTypeId: item?.contractType?._id
        }
      }
    })

    const payload: any = {
      sections
    };

    updateProfile(profile?._id, payload)
    .then(() => {
        onDissmiss()
    })
  };

  return (
    <Formik
      initialValues={{
        name: data?.name,
        description: data?.description
      }}
      onSubmit={handleSubmit}
    >
      <Form>
        <div>
          <div className="flex flex-col gap-4">
            <ApTextInput label="Expertise" name="name" placeHolder="Enter Expertise" />

            <ApTextInput
              label={'Description'}
              type="textarea"
              name="description"
              placeHolder="Enter Description"
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
