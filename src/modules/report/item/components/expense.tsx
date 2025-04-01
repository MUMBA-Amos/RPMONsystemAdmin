import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreateExpense } from '@/modules/expenses/components/create';
import { useExpenseState } from '@/modules/expenses/context';
import { IExpense } from '@/modules/expenses/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import moment from 'moment';
import { AP_DATE_FORMAT } from '@/constants';

interface IProps {
  title?: string;
  expenses: IExpense[];
  applicationId: string;
  reportId: string;
}

export default function ReportExpense({ applicationId, title, expenses, reportId }: IProps) {
  const { removeExpense } = useExpenseState();
  const { fetchReport, filter } = useReportState();
  const [modal, setModal] = useState<any>()

  const handleDelete = (id: string) => {
    removeExpense(id).then(() => {
      fetchReport(filter, true);
    });
  };

  const columns: any = [
    { title: 'Vote Head 1', dataIndex: ['voteHead', 'name'], key: 'voteHead' },
    { title: 'Quantity', dataIndex: 'quantity', key: 'quantity' },
    { title: 'Vendor', dataIndex: 'vendor', key: 'vendor' },
    {
      title: 'Invoice Date',
      dataIndex: 'invoiceDate',
      key: 'invoiceDate',
      render: (val: any) => moment(val)?.format(AP_DATE_FORMAT)
    },
    { title: 'Invoice Number', dataIndex: 'invoiceNumber', key: 'invoiceNumber' },
    { title: 'Invoice Amount', dataIndex: 'invoiceAmount', key: 'invoiceAmount' },
    { title: 'Origin', dataIndex: 'origin', key: 'origin' },
    { title: 'Payment Amount', dataIndex: 'paymentAmount', key: 'paymentAmount' },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (val: any) => moment(val)?.format(AP_DATE_FORMAT)
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon
            onClick={() => setModal({ data: record, show: true, type: 'update' })}
            tooltipTitle="Edit Expense"
          />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Expense"
          />
        </div>
      )
    }
  ];

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>{title || 'Expense'}</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable columns={columns} dataSource={expenses} />
      </div>

      <ApModal
        width={700}
        title={modal?.type === 'create' ? 'Add Expense' : 'Update Expense'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateExpense
          applicationId={applicationId}
          reportId={reportId}
          expense={modal?.data}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
