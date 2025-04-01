import { Tooltip } from 'antd';
import { useEffect, useState } from 'react';
import { BsHeadphones } from 'react-icons/bs';
import { FaEdit } from 'react-icons/fa';
import { FiPlus, FiTrash } from 'react-icons/fi';
import {
  ApBodyContainer,
  ApButton,
  ApContainer,
  ApDownloadButton,
  ApImage,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '../../components';
import { ApDateTime } from '../../components/date';
import { ApConfirmPopover, ApModal } from '../../components/modal';
import ApTable from '../../components/table';
import { INode, NodeService } from '../../services/node';
import { useMasterState } from './context';
import CreateMaster from './create';
import { IMaster, IMasterFilter } from './model';

type Props = {
  hasHeader?: boolean;
  addIssueEnabled?: boolean;
};

interface Node {
  _id: string;
  key?: string;
  name: string;
  parentId?: string;
  children?: Node[];
}

const Master = ({}: Props) => {
  const { master, fetchMaster, deleteMaster, totalRecords } = useMasterState();

  const [modal, setModal] = useState<{
    show: boolean;
    addChild?: boolean;
    data?: any;
    type?: 'parent' | 'child'; // Add the type property here
  }>({
    show: false
  });

  const [filter, setFilter] = useState<IMasterFilter>({
    page: 1,
    pageSize: 1000
  });

  const [data, setData] = useState<INode[]>([]);

  useEffect(() => {
    setData(NodeService.mapParentAndChildren(master as any));
  }, [master]);

  useEffect(() => {
    fetchMaster();
  }, [filter]);

  const handleSetMasterFilter = (filter: IMasterFilter) => {
    setFilter(filter);
  };

  const handleSearch = (val: string | undefined) => {
    if (val == undefined) return;
    handleSetMasterFilter({ ...filter, keyword: val });
  };

  const handleDelete = (record: IMaster) => {
    deleteMaster(record).then((rs) => {
      fetchMaster();
    });
  };

  const handleViewDetail = (record: IMaster) => {
    setModal({ show: true, data: record });
  };

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name'
    },
    {
      title: 'KEY',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'CATEGORIES',
      render: (_: any, record: IMaster) => (
        <>{record?.categoryList?.map((c) => c.name)?.join(',')}</>
      )
    },
    {
      title: 'IMAGE',
      render: (_: any, record: IMaster) => (
        <>
          {record?.image && <ApImage alt="img" width={70} height={70} src={record?.image?.uri} />}
        </>
      )
    },
    {
      title: 'CREATED AT',
      key: 'createdAt',
      render: (_: any, record: IMaster) => (
        <ApDateTime date={record?.createdAt} format="MMM Do YYYY" />
      )
    },
    {
      title: 'ACTION',
      dataIndex: '',
      width: '10%',
      key: 'addChild',
      render: (value: any, record: IMaster, index: number) => {
        return (
          <div className="flex bg-red w-14">
            <Tooltip placement="top" title="Edit" className="mr-5 cursor-pointer">
              <FaEdit
                size={34}
                className="text-blue-400"
                onClick={() => {
                  handleViewDetail(record);
                }}
              />
            </Tooltip>
            {record.key ? (
              <FiPlus
                size={34}
                className="text-cyan-500"
                onClick={() => {
                  setModal({
                    show: true,
                    data: { parentId: record._id, parent: record },
                    addChild: true
                  });
                }}
              />
            ) : (
              <ApConfirmPopover
                title="Delete master child record"
                onConfirm={() => {
                  handleDelete(record);
                }}
              >
                <FiTrash size={34} className="text-red-500" />
              </ApConfirmPopover>
            )}
          </div>
        );
      }
    }
  ];

  return (
    <div>
      <div>
        <ApPageHeader
          title="Master Data Maintainace"
          right={
            <>
              <ApDownloadButton
                title="Download Report"
                apiPath={`maintainance/master/download`}
                hasData={!!master.length}
                types={['PDF', 'XLSX']}
                filter={{ ...filter, skip: 0, take: totalRecords }}
              />
            </>
          }
        />

        <ApBodyContainer>
          <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
            <ApSummaryCard
              value={master?.length}
              title="Total Master Data"
              icon={<BsHeadphones color="#b6b30d" size={20} />}
              className="!w-[14rem]"
            />
          </ApSummaryContainer>

          <>
            <ApContainer className="pt-2">
              <div className="flex items-center justify-between pb-2 mb-5 border-b-2">
                <div className="flex  w-full h-full gap-3 cus-sm2:grid cus-sm2:grid-cols-2 justify-between items-center">
                  <ApSearchInput
                    label="Search by (Name,Key)"
                    debounce={0}
                    placeholder="Search"
                    containerClassName="cus-sm2:w-full cus-sm2:col-span-2"
                    value={filter?.keyword}
                    onSearchChange={handleSearch}
                  />

                  <ApButton
                    title="New Master Data"
                    className="cus-sm2:w-full cus-sm2:col-span-2 bg-cyan-500 text-white"
                    onClick={() => {
                      setModal({ show: true, type: 'parent' }); // Set the type to 'parent'
                    }}
                  />
                </div>
              </div>

              <ApTable
                columns={columns as any}
                rowKey={(record) => record._id}
                dataSource={data}
                pagination={false}
              />
            </ApContainer>
          </>
        </ApBodyContainer>
      </div>

      <ApModal
        title={modal.type === 'parent' ? 'Create Parent Master Data' : 'Master Data'}
        subTitle={'Manage master data'}
        show={modal.show}
        onDimiss={() => {
          setModal({ show: false });
        }}
      >
        <CreateMaster
          master={modal.data}
          addChild={modal.addChild}
          type={modal.type} // Pass the type here
          onDismiss={(res) => {
            setModal({ show: false });
            if (res) {
              fetchMaster();
            }
          }}
        />
      </ApModal>
    </div>
  );
};

export default Master;
