import { ApTextInput, ApButton, ApDateRangePicker } from '@/components';
import { Form, Formik } from 'formik';
import React from 'react';
import { useProfileState } from '../../context';
import moment from 'moment';

export default function UpdateAcademicInformation({ onDissmiss, data }: any) {
  const { profile, updateProfile, updating } = useProfileState();

  const handleSubmit = (val: any) => {
    const originalIndex = profile?.sections?.findIndex((section) => section === data);
    const sections = profile.sections.map((item, i) => {
      if (i == originalIndex) {
        return {
          kind: 'ACADEMIC',
          institution: val?.institution,
          qualification: val?.qualification,
          fieldOfStudy: val?.fieldOfStudy,
          fromDate: val?.duration?.fromDate,
          toDate: val?.duration?.toDate
        };
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
        };
      }
    });

    const payload: any = {
      sections
    };

    updateProfile(profile?._id, payload).then(() => {
      onDissmiss();
    });
  };

  return (
    <Formik
      initialValues={{
        institution: data?.institution,
        qualification: data?.qualification,
        fieldOfStudy: data?.fieldOfStudy,
        duration: { fromDate: data?.fromDate, toDate: data?.toDate }
      }}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <div>
            <div className="flex flex-col gap-4">
              <ApTextInput label="Institution" name="institution" placeHolder="Enter Institution" />

              <ApTextInput
                label="Qualification"
                name="qualification"
                placeHolder="Enter Qualification"
              />
              <ApTextInput
                label="Field of Study"
                name="fieldOfStudy"
                placeHolder="Enter Field of Study"
                containerClassName="col-span-1 md:col-span-2"
              />

              <ApDateRangePicker
                fromLabel="Start Date"
                toLabel="End Date"
                date={values?.duration}
                onChange={(date) => {
                  const fromDate = date.fromDate
                    ? moment(date.fromDate).valueOf()
                    : moment().valueOf();
                  const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

                  setFieldValue('duration', { fromDate, toDate });
                }}
                containerClassName={'w-full md:col-span-2 col-span-1'}
              />
            </div>
          </div>

          <div className="flex justify-end mt-5">
            <ApButton loading={updating} title="Update" type="submit" />
          </div>
        </Form>
      )}
    </Formik>
  );
}
