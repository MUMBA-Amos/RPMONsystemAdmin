import { ApButton, ApModal } from '@/components';
import { CreateSignoff } from '@/modules/signoff/components/create';
import { ISignoff } from '@/modules/signoff/model';
import React, { useState } from 'react';

interface IProps {
  signoff: ISignoff
  applicationId: string
  reportId: string
}

export default function ReportSignoff({ signoff, applicationId, reportId }: IProps) {
  const [ modal, setModal ] = useState<any>()

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Signoff</p>
        <ApButton
          onClick={() => {
            setModal({ show: true, type: 'update', data: signoff })
          }}
          title="Update"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className='font-medium text-primary'>Proposal Title</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.proposalTittle || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Investigators</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.investigators || '---'}</p>
        </div>
        
        <div>
          <p className='font-medium text-primary'>Executive Summary</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.executiveSummary || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Project Status</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.projectStatus || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Project Status Explanation</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.projectStatusExplanation || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Institution Name</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.institutionName || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Institution Address</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.institutionAddress || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Telephone</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.telephone || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Email</p>
          <p className='leading-loose mt-1 text-sm'>{signoff?.email || '---'}</p>
        </div>
      </div>

      <ApModal
        title={modal?.type === 'create' ? 'Add Signoff' : 'Update Signoff'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateSignoff
          applicationId={applicationId}
          reportId={reportId}
          signoff={signoff}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
