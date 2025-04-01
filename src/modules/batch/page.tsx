import React, { useEffect } from 'react';
import { useBatchState } from './context';
import { BatchTable } from './components/table';
import { ApBodyContainer, ApButton, ApModal, ApPageHeader, ApSearchInput, ApSummaryCard, ApSummaryContainer } from '@/components';
import { CreateBatch } from './components/create';
import { FaPlus } from 'react-icons/fa6';
import { BsHeadphones } from 'react-icons/bs';

export const BatchPage = () => {
  const { fetchBatch, batches, totalRecords, loading, setModal, modal, filter, setFilter } =
    useBatchState();

  useEffect(() => {
    fetchBatch(filter);
  }, [filter]);

  return (
    <>
      <ApPageHeader title="Batch" right={<ApButton
        className="rounded-md"
        onClick={() => setModal({ show: true, type: 'create' })}
        btnType="primary"
      >
        Create Batch <FaPlus size={20} className="text-white" />
      </ApButton>} />
      <ApBodyContainer className="">
      <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
        <ApSummaryCard
          value={totalRecords}
          title="Total Batches"
          icon={<BsHeadphones color="#b6b30d" size={20} />}
          className="!w-[14rem]"
        />
      </ApSummaryContainer>
        <div className="flex items-end justify-start gap-3">
          <ApSearchInput
            placeholder="Search Batch"
            containerClassName="!w-72"
            value={filter.keyword}
            onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
          />
        </div>
        <BatchTable batches={batches} loading={loading} />

        <ApModal
          width={700}
          title={modal.type === 'create' ? 'CREATE BATCH' : 'UPDATE BATCH'}
          onDimiss={() => setModal({ show: false })}
          show={modal.show}
        >
          <CreateBatch batch={modal.data} onDissmiss={() => setModal({ show: false })} />
        </ApModal>
      </ApBodyContainer>

    </>
  );
};
