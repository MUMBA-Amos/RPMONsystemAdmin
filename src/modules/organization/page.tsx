import {
  ApBodyContainer,
  ApButton,
  ApDateRangePicker,
  ApDeleteRowIcon,
  ApEditRowIcon,
  ApModal,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer,
  ApViewDetailBtn
} from '@/components';
import ApTable from '@/components/table';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { ColumnsType } from 'antd/es/table';
import { useEffect } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { CreateGrant } from '../grant/components/create';
import { useOrganizationState } from './context';
import { IOrganization } from './model';
import { CreateOrganization } from './components/create';
import moment from 'moment';
import { BsHeadphones } from 'react-icons/bs';

export const OrganizationPage = () => {
  const {
    loading,
    modal,
    setModal,
    filter,
    setFilter,
    totalRecords,
    deleteOrganization,
    fetchOrganization,
    organizations
  } = useOrganizationState();

  useEffect(() => {
    fetchOrganization(filter);
  }, [filter]);

  const columns: ColumnsType<IOrganization> = [
    {
      title: 'Ref',
      dataIndex: 'ref'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_, record: IOrganization) => (
        <div className="flex space-x-2 justify-end">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Grant" />
          <ApDeleteRowIcon onConfirm={() => handleDelete(record)} tooltipTitle="Delete Grant" />
        </div>
      )
    }
  ];

  const handleEdit = (org: IOrganization) => {
    setModal({ show: true, data: org });
  };

  const handleDelete = (org: IOrganization) => {
    deleteOrganization(org._id);
  };

  const handleCreate = () => {
    setModal({ show: true, type: 'create' });
  };

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : undefined;
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : undefined;
    setFilter({ ...filter, fromDate, toDate });
  };

  return (
    <>
      <ApPageHeader
        title="Organizations"
        right={
          <div className="flex gap-5 justify-end">
            <ApDateRangePicker
              date={{
                fromDate: filter?.fromDate,
                toDate: filter?.toDate
              }}
              onChange={handleDateChange}
            />
            <ApButton className="rounded-md" onClick={handleCreate} btnType="primary">
              Create Orgnazation <FaPlus size={20} className="text-white" />
            </ApButton>
          </div>
        }
      />
      <ApBodyContainer>
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Organizations"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>
        <div className="flex flex-col gap-6">
          <div className="flex items-end justify-start gap-3">
            <ApSearchInput
              placeholder="Search Organiization"
              containerClassName="!w-72"
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />
          </div>

          <ApTable
            columns={columns}
            dataSource={organizations}
            loading={loading}
            // pagination={mapTablePagination({
            //     filter,
            //     totalRecords,
            //     setFilter,
            //     onChange: handleTableChange
            // })}
            className="border rounded-lg outline-none"
          />
        </div>
      </ApBodyContainer>
      <ApModal
        width={700}
        title={modal.type === 'create' ? 'Create Organization' : 'Update Organization'}
        onDimiss={() => setModal({ show: false })}
        show={modal.show}
      >
        <CreateOrganization
          organization={modal.data}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </>
  );
};
