import { DEFAULT_PAGE_SIZE } from '@/constants';
import { useDepartmentState } from './context';
import { IDepartment, IDepartmentFilter } from './model';
import { useEffect, useState } from 'react';
import {
  ApBodyContainer,
  ApButton,
  ApContainer,
  ApDeleteRowIcon,
  ApDownloadButton,
  ApModal,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer,
  ApText,
  ApViewDetailBtn
} from '@/components';
import { Tooltip } from 'antd';
import { FaEdit } from 'react-icons/fa';
import { BiShoppingBag } from 'react-icons/bi';
import ApTable from '@/components/table';
import CreateDepartment from './components/create';
import { useUserState } from '../user/context';

const DepartmentPage = () => {
  const {
    loading,
    departments,
    modal,
    setModal,
    deleteDepartment,
    totalRecords,
    fetchDepartmentPage
  } = useDepartmentState();
  const {} = useUserState();
  const [filter, setFilter] = useState<IDepartmentFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  } as any);

  const handleDelete = (id: string) => {
    if (!id) return;

    deleteDepartment(id.toString());
  };

  useEffect(() => {
    fetchDepartmentPage({ ...filter, page: filter.page });
  }, [filter]);

  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'HOD',
      dataIndex: 'hodId',
      render: (_: any, department: IDepartment) => (
        <ApText>
          <>{department.hod?.name}</>
        </ApText>
      )
    },

    {
      title: 'Actions',
      dataIndex: 'actions',
      fixed: 'right',
      align: 'right',
      render: (_: any, department: IDepartment) => {
        return (
          <div className="flex items-end justify-end gap-2">
            <ApDeleteRowIcon
              popoverTitle="Delete department ?"
              tooltipTitle="Delete"
              onConfirm={() => {
                handleDelete(department._id);
              }}
            />

            <Tooltip placement="top" title="Edit">
              <FaEdit
                className="text-xl text-blue-400 cursor-pointer"
                onClick={() => {
                  setModal({ show: true, data: department, type: 'update' });
                }}
              />
            </Tooltip>

            {/* <ApViewDetailBtn href={`/department/${department?._id}`} /> */}
          </div>
        );
      }
    }
  ];

  return (
    <>
      <div className="w-full">
        <ApPageHeader
          title="Departments"
          right={
            <div className="flex items-center gap-4">
              <ApButton
                title="Add department"
                className="place-self-end"
                onClick={() => setModal({ show: true, type: 'create' })}
              />

              <ApDownloadButton
                title="Download Report"
                apiPath={`maintainance/department/download`}
                hasData={!!departments.length}
                types={['PDF', 'XLSX']}
                filter={{ ...filter, skip: 0, take: totalRecords }}
              />
            </div>
          }
        />

        <ApBodyContainer>
          <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3 grid grid-cols-4">
            <ApSummaryCard
              value={departments.length}
              title="Count"
              icon={<BiShoppingBag color="#DAA520" size={20} />}
            />
          </ApSummaryContainer>

          <ApContainer>
            <div className="flex items-end justify-start gap-3 mb-3">
              <ApSearchInput
                onSearchChange={() => {}}
                placeholder="Search name"
                containerClassName="!w-full"
                value={''}
                label="Search"
              />
            </div>

            <ApTable
              columns={columns}
              dataSource={departments}
              loading={loading}
              rowKey={(row) => row._id}
              pagination={{
                defaultCurrent: 1,
                defaultPageSize: filter?.pageSize,
                current: filter.page,
                total: totalRecords,
                onChange(page, pageSize) {
                  setFilter({
                    ...filter,
                    page: pageSize !== filter.pageSize ? 1 : page,
                    pageSize
                  });
                }
              }}
            />
          </ApContainer>
        </ApBodyContainer>
        <ApModal
          title={`${modal.type} Department`}
          subTitle="Fill in the form to add a new Department"
          show={modal.show}
          onDimiss={() => {
            setModal({ show: false });
          }}
        >
          {<CreateDepartment onDismiss={() => setModal({ show: false })} />}
        </ApModal>
      </div>
    </>
  );
};

export default DepartmentPage;
