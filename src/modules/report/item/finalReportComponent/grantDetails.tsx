import { AP_DATE_FORMAT } from '@/constants';
import helper from '@/helper';
import { IApplication } from '@/modules/application/model';
import moment from 'moment';

interface IProps {
  application: IApplication
}

export default function FinalReportGrantDetails({ application }: IProps) {

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Grant Details</p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Name</p>
          <p className="leading-loose mt-1 text-sm">{application?.grant?.name ?? '---'}</p>
        </div>

        <div>
          <p className="font-medium text-primary">End Date</p>
          <p className="leading-loose mt-1 text-sm">
            {moment(application?.grant?.toDate).format(AP_DATE_FORMAT)}
          </p>
        </div>

        <div className="flex justify-between">
          <div>
            <p className="font-medium text-primary">Maximum Budget</p>
            <p className="leading-loose mt-1 text-sm">{helper.toCurrency(application?.grant?.budget ?? 0)}</p>
          </div>

          <div>
            <p className="font-medium text-primary">Maximum Duration</p>
            <p className="leading-loose mt-1 text-sm">
              {moment(application?.grant?.toDate).format(AP_DATE_FORMAT)}
            </p>
          </div>
        </div>


        <div>
          <p className="font-medium text-primary">Reference Code</p>
          <p className="leading-loose mt-1 text-sm">{application?.grant?.ref}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Research Focus</p>
          <p className="leading-loose mt-1 text-sm">{application?.grant?.description}</p>
        </div>

        <div>
          <p className="font-medium text-primary">Proposal Title</p>
          <p className="leading-loose mt-1 text-sm">{application?.proposalTitle}</p>
        </div>
      </div>
    </div>
  );
}
