import { ApButton, ApSelectInput, ApTextInput } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { useVoteHeadState } from '@/modules/vote-heads/context';
import { Field, FieldArray, Form, Formik } from 'formik';
import React, { useEffect, useMemo, useState } from 'react';
import { GrantTypes } from '../../model';
import { useBudgetState } from '@/modules/budget/context';
import { IBudget, IBudgetVoteHead } from '@/modules/budget/model';
import { TableColumnsType } from 'antd';
import { useApplicationState } from '../../context';

interface BudgetVoteHead {
  id: number;
  amount: string;
  voteHead: string;
  description: string;
}

export default function GrantApplicationBudget({ applicationId, onNext, onBack }: any) {
  const { budgets, removeBudget } = useBudgetState();
  const [showForm, setShowForm] = useState(budgets?.length === 0);
  const [editingBudget, setEditingBudget] = useState<any>(null);

  const handleEdit = (budget: any) => {
    setEditingBudget(budget);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    removeBudget(id);
  };



  const columns: any = [
    { title: 'Year', dataIndex: 'year', key: 'year' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Budget" />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record?._id)}
            tooltipTitle="Delete Budget"
          />
        </div>
      )
    }
  ];

  const expandColumns: TableColumnsType<any> = [
    {
      title: 'Vote Head Name',
      dataIndex: 'name',
      key: 'name',
      render: (val: any, record: any) => record?.voteHead?.name
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
      render: (val: any, record: any) => record?.amount
    },
    { title: 'Description', dataIndex: 'description', key: 'description' }
  ];

  const expandedRowRender = (budget: IBudget) => (
    <ApTable columns={expandColumns} dataSource={budget?.voteHeads} pagination={false} />
  );


  return (
    <div>
      <div className="flex justify-end mb-5">
        <ApButton
          onClick={() => {
            setShowForm(!showForm);
            setEditingBudget(null);
          }}
          title={showForm ? 'Close' : 'Add Budget'}
          className="!w-[200px] !py-3"
        />
      </div>

      {showForm ? (
        <AddForm
          applicationId={applicationId}
          editingBudget={editingBudget}
          onNext={() => {
            setShowForm(false);
            setEditingBudget(null);
          }}
        />
      ) : (
        <div className="flex flex-col gap-5">
          {budgets?.length == 0 ? (
            <div className="text-sm flex justify-center items-center p-10">
              <p>No Data</p>
            </div>
          ) : (<ApTable expandable={{ expandedRowRender }} columns={columns} dataSource={budgets} />)}
        </div>
      )}

      <div className="flex justify-between mt-10 border-t pt-5">
        <ApButton
          btnType="outline"
          title="Back"
          className="!w-[200px] !py-3"
          type="button"
          onClick={onBack}
        />
        <ApButton onClick={onNext} title="Next" className="!w-[200px] !py-3" />
      </div>
    </div>
  );
}

const AddForm = ({
  onNext,
  applicationId,
  editingBudget
}: {
  onNext: any;
  applicationId: string;
  editingBudget: IBudget;
}) => {
  const { fetchVoteHead, voteHeads } = useVoteHeadState();
  const { saveBudget, updating } = useBudgetState();
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

  const initialValues = editingBudget
    ? {
      year: editingBudget?.year,
      voteHeads: editingBudget?.voteHeads?.map((item) => ({
        voteHeadId: item?.voteHeadId,
        description: item?.description,
        voteHead: {
          ...item?.voteHead
        }
      }))
    }
    : {
      year: '',
      voteHeads: voteHeadList
    };

  const handleSubmit = (val: any) => {
    const payload = {
      year: parseInt(val?.year),
      applicationId,
      voteHeads: val?.voteHeads?.map((item: any) => ({
        voteHeadId: item?.voteHeadId,
        description: item?.description,
        amount: +item?.amount,
      }))
    };

    saveBudget(payload, editingBudget._id).then(() => {
      fetchApplication(applicationId);
      onNext()
    });

  };

  return (
    <div>
      <Formik initialValues={initialValues} enableReinitialize onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form className="space-y-5">
            <ApTextInput type="number" label="Year" name="year" placeholder="Enter Year" />
            <div className="grid grid-cols-2 gap-5">
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
                      title: 'Vote head Amount',
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
                          className="border p-2 w-full resize-none focus:border-gray-400 outline-none rounded-sm"
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
                title={editingBudget ? 'Update' : 'Save'}
                type="submit"
                className="!w-[80px] !py-2"
                loading={updating}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
