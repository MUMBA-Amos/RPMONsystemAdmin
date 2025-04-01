import React, { useEffect, useState } from 'react';
import { ApTextInput, ApButton, ApCheckbox, ApDateRangePicker } from '@/components';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import moment from 'moment';
import { useReportState } from '../context';
import { useApplicationState } from '@/modules/application/context';

const FormSchema = Yup.object().shape({
  user: Yup.string().required('User is required'),
  decision: Yup.string().required('Decision is required'),
  comment: Yup.string().required('Comment is required'),
  revision: Yup.string().required('Revision is required')
});

interface IProps {
  reportDetail?: any;
  onDissmiss: () => void;
}

export const CreateReportFinalDetails: React.FC<IProps> = ({ onDissmiss, reportDetail }) => {

  const [duration, setDuration] = useState<{ fromDate: number; toDate: number }>({
    fromDate: moment().valueOf(),
    toDate: moment().valueOf()
  });

  const { saveReport } = useReportState();

  const { fetchApplication } = useApplicationState();

  useEffect(() => {
    if (reportDetail) {
      setDuration({
        fromDate: reportDetail?.fromDate || moment().valueOf(),
        toDate: reportDetail?.toDate || moment().valueOf()
      });
    }
  }, [reportDetail]);

  const handleSubmit = (values: any) => {
    saveReport(reportDetail?._id, {
      ...values,
      fromDate: duration.fromDate,
      toDate: duration.toDate
    }).then(() => {
      fetchApplication(reportDetail?.applicationId);
      onDissmiss();
    })
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setDuration({ fromDate, toDate });
  };

  return (
    <Formik
      initialValues={{
        researchSummary: reportDetail?.researchSummary || '',
        projectOverview: reportDetail?.projectOverview || '',
        futureResearchDescription: reportDetail?.futureResearchDescription || '',
        researchCollaboration: reportDetail?.researchCollaboration || ''
      }}
      // validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<any>) => (
        <div className="flex flex-col space-y-4">
          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="researchSummary"
              label="Research Summary"
              placeholder="Enter Research Summary"
              containerClassName={'w-full'}
            />
          </div>

          <ApTextInput
            type="textarea"
            name="projectOverview"
            label="Project Overview"
            placeholder="Enter Project Overview"
            containerClassName={'w-full'}
          />
          <ApDateRangePicker
            containerClassName={'w-full'}
            fromLabel="From Date"
            toLabel="To Date"
            date={duration}
            onChange={(date) => handleDateChange(date)}
          />
          <ApTextInput
            type="textarea"
            name="futureResearchDescription"
            label="Future Research Description"
            placeholder="Enter Future Research Description"
            containerClassName={'w-full'}
          />
          <ApTextInput
            type="textarea"
            name="researchCollaboration"
            label="Research Collaboration Description"
            placeholder="Enter Research Collaboration Description"
            containerClassName={'w-full'}
          />

          <ApButton title={'Submit'} type="submit" onClick={props.handleSubmit} />
        </div>
      )}
    </Formik>
  );
};
