import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon, ApViewDetailBtn } from '@/components/table';
import { CreatePublication } from '@/modules/publication/components/create';
import { usePublicationState } from '@/modules/publication/context';
import { IPublication } from '@/modules/publication/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import moment from 'moment';
import { AP_DATE_FORMAT } from '@/constants';
import { IReport } from '../../model';

interface IProps {
  finalReport: IReport;
}

export default function FinalReportSubmission({ finalReport }: IProps) {
  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Report Submission</p>
      </div>

      <div className="p-5 flex flex-col gap-5">
        <div>
          <p className="font-medium text-primary">Submitted on</p>
          <p className="leading-loose mt-1 text-sm">
            {moment(finalReport?.toDate).format(AP_DATE_FORMAT)}
          </p>
        </div>
      </div>
    </div>
  );
}
