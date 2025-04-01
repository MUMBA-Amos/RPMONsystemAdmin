import { IProfile } from '@/modules/profile/model';

interface IProps {
  researcher: IProfile;
  reportId: string;
}

export default function FinalReportResearcher({ researcher, reportId }: IProps) {

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Researcher Details</p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Name</p>
          <p className="leading-loose mt-1 text-sm">{researcher?.user?.firstName} {researcher?.user?.lastName}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Resident Status</p>
          <p className="leading-loose mt-1 text-sm">{researcher?.residenceStatus?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Organization</p>
          <p className="leading-loose mt-1 text-sm">{researcher?.organization?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Position</p>
          <p className="leading-loose mt-1 text-sm">{researcher?.designation?.name || '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Service</p>
          <p className="leading-loose mt-1 text-sm">{researcher?.service || '---'}</p>
        </div>
      </div>
    </div>
  );
}
