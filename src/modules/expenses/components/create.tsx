import React, { useEffect, useMemo } from 'react';
import { ApTextInput, ApButton, ApCheckbox, ApSelectInput } from '@/components';
import { Formik } from 'formik';
import { useExpenseState } from '../context';
import { IExpense } from '../model';
import * as Yup from 'yup';
import ApDateInput from '@/components/input/DatePicker';
import { useVoteHeadState } from '@/modules/vote-heads/context';
import { useReportState } from '@/modules/report/context';
import { useApplicationState } from '@/modules/application/context';

const FormSchema = Yup.object().shape({
  // justification: Yup.string().required('Justification is required'),
  // workplan: Yup.string().required('Workplan is required'),
  // deviationReason: Yup.string().required('Deviation reason is required'),
  // remedialAction: Yup.string().required('Remedial action is required'),
  // duration: Yup.string().required('Duration is required')
});

interface IProps {
  reportId: string
  applicationId: string;
  expense: IExpense;
  onDissmiss: () => void;
}

export const CreateExpense: React.FC<IProps> = ({ reportId, expense, onDissmiss, applicationId }) => {
  const { saveExpense, updating } = useExpenseState();
  const { fetchVoteHead, voteHeads } = useVoteHeadState();
  const { fetchReport, reports, filter } = useReportState();
  const { fetchApplication } = useApplicationState();

  useEffect(() => {
    fetchVoteHead({ page: 1, pageSize: 500 });
  }, []);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      voteheadId: values?.voteHead?.value,
      invoiceDate: parseInt(values?.invoiceDate),
      invoiceNumber: parseInt(values?.invoiceNumber),
      invoiceAmount: parseInt(values?.invoiceAmount),
      paymentAmount: parseInt(values?.paymentAmount),
      paymentDate: parseInt(values?.paymentDate),
      reportId: reportId ? reportId : values?.report?._id,
      applicationId
    };

    delete payload?.report;

    delete payload?.voteHead

    saveExpense(payload, expense?._id).then((res) => {
      if (res) {
        fetchApplication(applicationId);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={{
        quantity: expense?.quantity || '',
        vendor: expense?.vendor || '',
        invoiceDate: expense?.invoiceDate || '',
        invoiceNumber: expense?.invoiceNumber || '',
        invoiceAmount: expense?.invoiceAmount || '',
        origin: expense?.origin || '',
        paymentAmount: expense?.paymentAmount || '',
        paymentDate: expense?.paymentDate || '',
        milestone: expense?.milestone || '',
        description: expense?.description || '',
        report: reports.find((report) => report._id === reportId) || reports[0],
        voteHead: expense?.voteheadId
          ? {
            value: voteHeads?.filter((item) => item?._id == expense?.voteheadId)[0]?._id,
            label: voteHeads?.filter((item) => item?._id == expense?.voteheadId)[0]?.name
          }
          : ''
      }}
      validationSchema={FormSchema}
      onSubmit={handleSubmit}
    >
      {({ submitForm }) => (
        <div className="flex flex-col space-y-4">

          <div className="grid  grid-flow-col gap-4">
            <ApSelectInput
              options={voteHeads?.map((item) => ({
                value: item?._id,
                label: item?.name
              }))}
              label="Vote Head"
              name="voteHead"
              placeholder="Select Vote Head"
            />

            {!reportId &&
              <ApSelectInput label='Report' name={'report'} options={reports} valueKey='_id' labelKey='title' />}

          </div>

          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="quantity"
              label="Quantity"
              placeholder="Enter quantity"
              containerClassName={'w-full'}
            />
            <ApDateInput name="invoiceDate" label="Invoice Date" containerClassName={'w-full'} />
          </div>

          <div className="flex gap-4">
            <ApTextInput
              type="number"
              name="invoiceNumber"
              label="Invoice Number"
              placeholder="Enter invoice number"
              containerClassName={'w-full'}
            />

            <ApTextInput
              type="number"
              name="invoiceAmount"
              label="Invoice Amount"
              placeholder="Enter invoice amount"
              containerClassName={'w-full'}
            />
          </div>

          <div className="flex gap-4">
            <ApTextInput
              type="text"
              name="origin"
              label="Origin"
              placeholder="Enter origin"
              containerClassName={'w-full'}
            />

            <ApTextInput
              type="number"
              name="paymentAmount"
              label="Payment Amount"
              placeholder="Enter payment amount"
              containerClassName={'w-full'}
            />
          </div>

          <div className="flex gap-4">
            <ApDateInput name="paymentDate" label="Payment Date" containerClassName={'w-full'} />

            <ApTextInput
              type="text"
              name="vendor"
              label="Vendor"
              placeholder="Enter vendor"
              containerClassName={'w-full'}
            />
          </div>

          <ApTextInput
            type="text"
            name="milestone"
            label="Milestone"
            placeholder="Enter milestone"
            containerClassName={'w-full'}
          />

          <ApTextInput
            type="textarea"
            name="description"
            label="Description"
            placeholder="Enter description"
            containerClassName={'w-full'}
          />

          <ApButton
            title={expense?._id ? 'Update' : 'Create'}
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
