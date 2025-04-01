import { IApplication } from '../application/model';
import ReportItem from './item';

interface IProps {
  application?: IApplication;
}

export default function ApplicationReports({ application }: IProps) {

  console.log('application', application?.reports);

  return (
    <div className="mt-10 flex flex-col gap-5">
      {application?.reports?.map((item, i) => (
        <div key={item?._id}>
          <ReportItem
            isFirst={i == 0}
            applicationId={application?._id as string}
            report={item}
            application={application}
          />
        </div>
      ))}
    </div>
  );
}
