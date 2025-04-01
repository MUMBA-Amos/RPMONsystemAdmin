import { ApButton, ApDateRangePicker, ApTextInput } from '@/components';
import { useApplicationState } from '@/modules/application/context';
import { useReportState } from '@/modules/report/context';
import { Form, Formik, FormikProps } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import * as Yup from 'yup';
import { useActivityState } from '../context';
import { IActivity } from '../model';

const FormSchema = Yup.object().shape({

});

interface IProps {
  reportId: string
  type: string
  parentId: string
  applicationId: string;
  activity: IActivity;
  onDissmiss: () => void;
}

export const CreateActivity: React.FC<IProps> = ({ reportId, activity, onDissmiss, applicationId, parentId, type }) => {
  const { saveActivity, updating } = useActivityState();
  const { fetchReport, filter } = useReportState()
  const { fetchApplication } = useApplicationState();
  const [duration, setDuration] = useState<{ fromDate: number; toDate: number }>({
    fromDate: activity?.fromDate || 0,
    toDate: activity?.toDate || 0
  });

  const handleSubmit = (val: any) => {

    const { fromDate, toDate } = duration;

    const payload: any = {
      ...val,
      type,
      percentage: Number(val.percentage),
      reportId,
      applicationId,
      parentId: parentId,
      fromDate,
      toDate
    };

    !payload?.parentId && delete payload?.parentId


    saveActivity(payload, activity?._id, true).then((res) => {
      if (res) {
        fetchReport({ ...filter, applicationId }, true);
        fetchApplication(applicationId);
        onDissmiss();
      }
    });
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setDuration({ fromDate, toDate });
  };

  return (
    <Formik
      initialValues={{ name: activity?.name || '', description: activity?.description || '', percentage: activity?.percentage || 0 }}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<any>) => (
        <Form className="flex flex-col gap-5">

          <div className="grid grid-cols-2 gap-4">
            <ApTextInput label={type} name="name" placeHolder={type} />
            <ApTextInput type="number" label={'Percentage Completed'} name="percentage" placeHolder={'e.g 5'} />
          </div>


          <ApDateRangePicker
            fromLabel="Start Date"
            toLabel="End Date"
            date={duration}
            onChange={(date) => handleDateChange(date)}
            containerClassName={'w-full'}
          />

          <ApTextInput label="Description" name="description" type="textarea" placeHolder="Details" />

          <div className="flex justify-end mt-5">
            <ApButton title="Save" className="!w-[80px] !py-2" type="submit" loading={updating} />
          </div>
        </Form>
      )}
    </Formik>
  );
};
