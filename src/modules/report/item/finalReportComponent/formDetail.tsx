import { IApplication } from '@/modules/application/model';

interface IProps {
  application: IApplication;
}

export default function FinalReportFormDetails({ application }: IProps) {
  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Form Details</p>
        {/* <ApButton
          onClick={() => setModal({ show: true, type: 'create' })}
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        /> */}
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Status</p>
          <p className="leading-loose mt-1 text-sm">{application?.status || '---'}</p>
        </div>
        <div>
          <p className="font-medium text-primary">Revision</p>
          <p className="leading-loose mt-1 text-sm">{application?.revision ?? '--'}</p>
        </div>
      </div>
    </div>
  );
}
