import { useEffect, useState } from 'react';
import { BsHeadphones } from 'react-icons/bs';
import { FiPlus } from 'react-icons/fi';
import {
  ApBodyContainer,
  ApButton,
  ApImage,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '../../components';
import { ApDateTime } from '../../components/date';
import { ApModal } from '../../components/modal';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '../../components/table';
import { INode, NodeService } from '../../services/node';
import { useMasterState } from './context';
import CreateMaster from './create';
import { IMaster, IMasterFilter } from './model';

type Props = {
  hasHeader?: boolean;
  addIssueEnabled?: boolean;
};

const Master = ({ }: Props) => {
  const { master, fetchMaster, deleteMaster, totalRecords, filter, setFilter } = useMasterState();

  const [modal, setModal] = useState<{
    show: boolean;
    addChild?: boolean;
    data?: any;
    type?: 'parent' | 'child'; // Add the type property here
  }>({
    show: false
  });

  const [data, setData] = useState<INode[]>([]);

  useEffect(() => {
    setData(NodeService.mapParentAndChildren(master as any));
  }, [master]);

  useEffect(() => {
    fetchMaster(filter);
  }, [filter]);

  const handleSetMasterFilter = (filter: IMasterFilter) => {
    setFilter(filter);
  };

  const handleSearch = (val: string | undefined) => {
    if (val == undefined) return;
    handleSetMasterFilter({ ...filter, keyword: val });
  };

  const handleViewDetail = (record: IMaster) => {
    setModal({ show: true, data: record });
  };

  const columns = [
    {
      title: 'NAME',
      dataIndex: 'name'
    },
    // {
    //   title: 'KEY',
    //   dataIndex: 'key',
    //   key: 'key'
    // },
    {
      title: 'ACTION',
      dataIndex: '',
      width: '10%',
      key: 'addChild',
      render: (value: any, record: IMaster, index: number) => {
        return (
          <div className="flex bg-red w-14 items-center">
            <ApEditRowIcon onClick={() => handleViewDetail(record)} />
            {record.key ? (
              <FiPlus
                size={24}
                className="text-primary"
                onClick={() => {
                  setModal({
                    show: true,
                    data: { parentId: record._id, parent: record },
                    addChild: true
                  });
                }}
              />
            ) : (
              <ApDeleteRowIcon
                onConfirm={() => {
                  deleteMaster(record?._id);
                }}
              />
            )}
          </div>
        );
      }
    }
  ];

  return (
    <>
    {/* right={
        <ApButton
          title="New Master Data"
          className="cus-sm2:w-full cus-sm2:col-span-2 bg-cyan-500 text-white"
          onClick={() => {
            setModal({ show: true, type: 'parent' }); 
          }}
        />
      } */}
      <ApPageHeader title="Master Data" />
      <ApBodyContainer>
        <div>
          <>

            <>
              <div className="pt-2">
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


                  </div>
                </div>

                <ApTable
                  columns={columns as any}
                  rowKey={(record) => record._id}
                  dataSource={data}
                  pagination={false}
                />
              </div>
            </>
          </>
        </div>
      </ApBodyContainer>
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
              fetchMaster(filter);
            }
          }}
        />
      </ApModal>
    </>
  );
};

export default Master;
