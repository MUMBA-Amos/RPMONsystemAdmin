import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreateBudget } from '@/modules/budget/components/create';
import { useBudgetState } from '@/modules/budget/context';
import { IBudget } from '@/modules/budget/model';
import { TableColumnsType } from 'antd';
import { useState } from 'react';
import { useReportState } from '../../context';

interface IProps {
  title?: string;
  budgets: IBudget[];
  applicationId: string;
  reportId: string;
}

export default function ReportBudget({ applicationId, title, budgets, reportId }: IProps) {
  const { removeBudget } = useBudgetState();
  const { fetchReport, filter } = useReportState();
  const [modal, setModal] = useState<any>();
  console.log({ budgets });

  const handleEdit = (budget: any) => {
    setModal({ show: true, data: budget, type: 'update' });
  };

  const handleDelete = (id: string) => {
    removeBudget(id).then(() => {
      fetchReport(filter, true);
    });
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
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>{title || 'Budget'}</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <ApTable expandable={{ expandedRowRender }} columns={columns} dataSource={budgets} />
      </div>


      <ApModal
        width={700}
        title={modal?.type === 'create' ? 'Add Budget' : 'Update Budget'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateBudget
          applicationId={applicationId}
          reportId={reportId}
          budget={modal?.data}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
