import { ApButton, ApModal } from '@/components';
import ApplicationReviewer from '@/modules/application/create/components/reviewer';
import { IApplication } from '@/modules/application/model';
import { CreateExtenstion } from '@/modules/extenstion/components/create';
import { IExtenstion } from '@/modules/extenstion/model';
import { useState } from 'react';

interface IProps {
  extenstion: IExtenstion;
  application?: IApplication;
  reportId: string
}

export default function ReportExtension({ extenstion, application, reportId }: IProps) {
  const [modal, setModal] = useState<any>()

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Extension</p>
        <ApButton
          onClick={() => setModal({ show: true, type: 'update' })}
          title="Update"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className='font-medium text-primary'>Duration</p>
          <p className='leading-loose mt-1 text-sm'>{extenstion?.duration || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Justification</p>
          <p className='leading-loose mt-1 text-sm'>{extenstion?.justification || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Workplan</p>
          <p className='leading-loose mt-1 text-sm'>{extenstion?.workplan || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Deviation Reason</p>
          <p className='leading-loose mt-1 text-sm'>{extenstion?.deviationReason || '---'}</p>
        </div>

        <div>
          <p className='font-medium text-primary'>Remedial Action</p>
          <p className='leading-loose mt-1 text-sm'>{extenstion?.remedialAction || '---'}</p>
        </div>

      </div>

      {extenstion?.showReviewers &&
        <div className='p-5'>
          <ApplicationReviewer refId={extenstion?._id} reviewers={extenstion.reviewers} application={application as IApplication} />
        </div>
      }


      <ApModal
        title={modal?.type === 'create' ? 'Add Extension' : 'Update Extension'}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateExtenstion
          reportId={reportId}
          extenstion={extenstion}
          applicationId={extenstion?.applicationId}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}
