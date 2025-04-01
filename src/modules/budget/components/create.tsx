import React, { useEffect, useMemo } from 'react';
import { ApTextInput, ApButton, ApSelectInput } from '@/components';
import { Field, FieldArray, Form, Formik } from 'formik';
import { useBudgetState } from '../context';
import { IBudget } from '../model';
import * as Yup from 'yup';
import { useVoteHeadState } from '@/modules/vote-heads/context';
import { GrantTypes } from '@/modules/application/model';
import ApTable from '@/components/table';
import { useReportState } from '@/modules/report/context';
import { useApplicationState } from '@/modules/application/context';

interface BudgetVoteHead {
  id: number;
  amount: string;
  voteHead: string;
  description: string;
}

const FormSchema = Yup.object().shape({});

interface IProps {
  reportId: string;
  applicationId: string;
  budget?: IBudget;
  onDissmiss: () => void;
}

export const CreateBudget: React.FC<IProps> = ({ reportId, budget, onDissmiss, applicationId }) => {
  const { fetchVoteHead, voteHeads } = useVoteHeadState();
  const { saveBudget, updating } = useBudgetState();
  const { fetchReport, reports, filter } = useReportState();
  const { fetchApplication } = useApplicationState();

  useEffect(() => {
    fetchVoteHead({ page: 1, pageSize: 500 });
  }, []);

  const voteHeadList = useMemo(() => {
    let val: any = [];

    if (voteHeads) {
      val = voteHeads?.map((item) => ({
        voteHeadId: item?._id,
        description: '',
        voteHead: {
          amount: item?.amount,
          name: item?.name
        }
      }));
    }
    return val;
  }, [voteHeads]);

  const handleSubmit = (val: any) => {
    const payload = {
      year: parseInt(val?.year),
      grantType: val?.grantType?.value,
      voteHeads: val?.voteHeads?.map((item: any) => ({
        voteHeadId: item?.voteHeadId,
        description: item?.description,
        amount: +item?.amount,
      })),
      applicationId,
      reportId: reportId ? reportId : val?.report?._id,
    };

    delete val?.report;

    saveBudget(payload, budget?._id).then((res) => {
      if (res) {
        fetchApplication(applicationId);
        onDissmiss();
      }
    });
  };

  return (
    <Formik
      initialValues={
        budget
          ? {
            year: budget?.year,
            desription: budget?.description,
            grantType: budget?.grantType,
            voteHeads: budget?.voteHeads?.map((item) => ({
              voteHeadId: item?.voteHeadId,
              amount: item?.amount,
              description: item?.description,
              voteHead: {
                ...item?.voteHead
              }
            })),
            report: reports.find((report) => report._id === reportId) || reports[0]
          }
          : {
            year: '',
            grantType: '',
            voteHeads: voteHeadList
          }
      }
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form className="space-y-5">
          {/* Year & Grant Type Inputs */}
          <div className="grid grid-flow-col gap-4">
            <ApTextInput type="number" label="Year" name="year" placeholder="Enter Year" />
            {!reportId &&
              <ApSelectInput label='Report' name={'report'} options={reports} valueKey='_id' labelKey='title' />}
          </div>

          {/* Budget Vote Head Table */}
          <FieldArray name="voteHeads">
            {() => (
              <ApTable
                columns={[
                  {
                    title: 'Vote Head',
                    dataIndex: 'voteHead',
                    key: 'voteHead',
                    render: (val: any) => val?.name
                  },
                  {
                    title: 'Vote Head Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (val: any, record: any) => record?.voteHead?.amount
                  },
                  {
                    title: 'Amount',
                    dataIndex: 'amount',
                    key: 'amount',
                    render: (_: any, record: BudgetVoteHead, index: number) => (
                      <Field
                        name={`voteHeads[${index}].amount`}
                        placeholder="Enter amount"
                        className="border p-2 w-full resize-none focus:border-gray-400 outline-none rounded-sm"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newBudgets = [...values.voteHeads];
                          newBudgets[index].amount = e.target.value;
                          setFieldValue('voteHeads', newBudgets);
                        }}
                      />
                    )
                  },
                  {
                    title: 'Description',
                    dataIndex: 'description',
                    key: 'description',
                    render: (_: any, record: BudgetVoteHead, index: number) => (
                      <Field
                        as="textarea"
                        rows={1}
                        name={`voteHeads[${index}].description`}
                        placeholder="Enter description"
                        className="border p-[7px] w-full resize-none focus:border-gray-400 outline-none rounded-sm"
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                          const newBudgets = [...values.voteHeads];
                          newBudgets[index].description = e.target.value;
                          setFieldValue('voteHeads', newBudgets);
                        }}
                      />
                    )
                  }
                ]}
                dataSource={values.voteHeads}
              />
            )}
          </FieldArray>

          {/* Save Button */}
          <div className="flex justify-end">
            <ApButton
              title={budget?._id ? 'Update' : 'Save'}
              type="submit"
              className="!w-[80px] !py-2"
              loading={updating}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};
