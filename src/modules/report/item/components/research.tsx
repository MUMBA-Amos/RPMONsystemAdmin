import { ApButton, ApModal } from '@/components';
import { CreateResearch } from '@/modules/research/components/create';
import { useResearchState } from '@/modules/research/context';
import { IResearch } from '@/modules/research/model';
import React, { useState } from 'react';

interface IProps {
  research: IResearch
  applicationId: string
  reportId: string
}

export default function ReportResearch({ research, applicationId, reportId }: IProps) {
  // const { setModal, modal } = useResearchState();
  const [ modal, setModal ] = useState<any>()

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Research</p>
        <ApButton
          onClick={() => {
            setModal({ show: true, type: 'update', data: research })
          }}
          title="Update"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className='font-medium text-primary'>Version</p>
          <p className='leading-loose mt-1 text-sm'>{research?.version || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Overview</p>
          <p className='leading-loose mt-1 text-sm'>{research?.overview || '---'}</p>
        </div>
        
        <div>
          <p className='font-medium text-primary'>Methodology</p>
          <p className='leading-loose mt-1 text-sm'>{research?.methodology || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Results</p>
          <p className='leading-loose mt-1 text-sm'>{research?.results || '---'}</p>
        </div>

        {/* <div>
          <p className='font-medium text-primary'>Deviation Explanation</p>
          <p className='leading-loose mt-1 text-sm'>{research?.deviationExplanation || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Remedial Action</p>
          <p className='leading-loose mt-1 text-sm'>{research?.remedialAction || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Request Extention</p>
          <p className='leading-loose mt-1 text-sm'>{research?.requestExtention || '---'}</p>
        </div> */}

        <div>
          <p className='font-medium text-primary'>Duration</p>
          <p className='leading-loose mt-1 text-sm'>{research?.duration || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Explanation</p>
          <p className='leading-loose mt-1 text-sm'>{research?.explanation || '---'}</p>
        </div>
      </div>

      <ApModal
        title={modal?.type === 'create' ? 'Add Research' : 'Update Research'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateResearch
          applicationId={applicationId}
          reportId={reportId}
          research={research}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
