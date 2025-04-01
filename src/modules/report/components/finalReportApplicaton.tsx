import React from 'react';
import ReportItem from '../item';
import { IReport } from '../model';
import { IApplication } from '@/modules/application/model';

interface IProps {
  application: IApplication;
}

export default function FinalReportApplication({ application }: IProps) {
  return (
    <ReportItem
      isFirst
      isFinalReport
      applicationId={application?._id}
      report={application?.finalReport as IReport}
      application={application}
    />
  );
}
