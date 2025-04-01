import React, { useEffect } from 'react';
import { useVoteHeadState } from './context';
import { VoteHeadTable } from './components/table';
import {
  ApBodyContainer,
  ApButton,
  ApModal,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '@/components';
import { CreateVoteHead } from './components/create';
import { FaPlus } from 'react-icons/fa6';
import { BsHeadphones } from 'react-icons/bs';

export const VoteHeadPage = () => {
  const {
    fetchVoteHead,
    voteHeads,
    totalRecords,
    loading,
    setModal,
    modal,
    filter,
    setFilter
  } = useVoteHeadState();

  useEffect(() => {
    fetchVoteHead(filter);
  }, [filter]);

  return (
    <>
      <ApPageHeader
        title="Vote Header"
        right={
          <ApButton
            className="rounded-md"
            onClick={() => setModal({ show: true, type: 'create' })}
            btnType="primary"
          >
            Create Vote Header <FaPlus size={20} className="text-white" />
          </ApButton>
        }
      />
      <ApBodyContainer className="">
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Vote Headers"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>
        <div className="flex items-end justify-start gap-3">
          <ApSearchInput
            placeholder="Search Vote Header"
            containerClassName="!w-72"
            value={filter.keyword}
            onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
          />
        </div>
        <VoteHeadTable voteHeads={voteHeads} loading={loading} />

        <ApModal
          width={700}
          title={modal.type === 'create' ? 'CREATE VOTE HEADER' : 'UPDATE VOTE HEADER'}
          onDimiss={() => setModal({ show: false })}
          show={modal.show}
        >
          <CreateVoteHead voteHead={modal.data} onDissmiss={() => setModal({ show: false })} />
        </ApModal>
      </ApBodyContainer>
    </>
  );
};
