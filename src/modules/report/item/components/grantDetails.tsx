import { ApButton, ApModal } from '@/components';
import helper from '@/helper';
import { CreateGrant } from '@/modules/grant/components/create';
import { IGrant } from '@/modules/grant/model';
import React, { useState } from 'react';

interface IProps {
  grant: IGrant | undefined;
}

export default function ReportGrantDetails({ grant }: IProps) {
  // const { setModal, modal } = useResearchState();
  const [modal, setModal] = useState<any>();

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Grant Details</p>
        <ApButton
          onClick={() => {
            setModal({ show: true, type: 'create' });
          }}
          title="Create"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Name</p>
          <p className="leading-loose mt-1 text-sm">{grant?.name ?? '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Budget</p>
          <p className="leading-loose mt-1 text-sm">{helper.toCurrency(grant?.budget ?? 0)}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Status</p>
          <p className="leading-loose mt-1 text-sm">{grant?.status || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Grant Description</p>
          <p className="leading-loose mt-1 text-sm">{grant?.description || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Grant Batch</p>
          <p className="leading-loose mt-1 text-sm">{grant?.batch?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Grant Cluster</p>
          <p className="leading-loose mt-1 text-sm">{grant?.cluster?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Grant Scheme</p>
          <p className="leading-loose mt-1 text-sm">{grant?.scheme?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Organization Name</p>
          <p className="leading-loose mt-1 text-sm">{grant?.organization?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Organization Address</p>
          <p className="leading-loose mt-1 text-sm">{grant?.organization?.address || '---'}</p>
        </div>
      </div>

      <ApModal
        title={modal?.type === 'create' ? 'Add Grant' : 'Update Grant'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateGrant grant={grant as any} onDissmiss={() => setModal({ show: false })} />
      </ApModal>
    </div>
  );
}
