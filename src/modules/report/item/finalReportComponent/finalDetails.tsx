import { ApButton, ApModal, ApText } from '@/components';
import React, { useState } from 'react';
import { IReport } from '../../model';
import { CreateReportFinalDetails } from '../../components/reportFinalDetails';
import { ApDateTime } from '@/components/date';

interface IProps {
  report: IReport;
}

const FinalReportDetails: React.FC<IProps> = ({ report }) => {
  const [modal, setModal] = useState<{ show: boolean }>({ show: false });
  const handleDismiss = () => {
    setModal({ show: false });
  };
  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>Final Details</p>
        <ApButton
          onClick={() => setModal({ show: true })}
          title="Update"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-4">
        <div className="my-4">
          <ApText size="sm" font="semibold">
            Executive Summary of Research:
          </ApText>
        </div>
        <div>
          <ApText size="sm" className="leading-10 font-normal">
            {report?.researchSummary}
          </ApText>
        </div>
        <div className="flex flex-row gap-4 mt-5">
          <div>
            <ApText font="bold" size="sm">
              From:
            </ApText>
            <ApDateTime date={report?.fromDate} />
          </div>
          <div>
            <ApText font="bold" size="sm">
              To:
            </ApText>
            <ApDateTime date={report?.toDate} />
          </div>

        </div>
        <div>
          <div className="my-4">
            <ApText font="semibold" size="sm">
              Please provide an overview of the project:
            </ApText>
          </div>
          <ApText size="sm" className="leading-10 font-normal">
            {report?.projectOverview}
          </ApText>
        </div>
        <div>
          <div className="my-4">
            <ApText size="sm" font="semibold">
              Describe areas of future research identified by the project (max 1000 words):
            </ApText>
          </div>
          <ApText size="sm" className="leading-10 font-normal">
            {report?.futureResearchDescription}
          </ApText>
        </div>
        <div className="flex flex-col gap-4">
          <div className="my-4">
            <ApText size="sm" font="semibold" className="">
              Describe whether the project has been able to strengthen collaboration with other
              scientists and research institutions, build links with other projects supported by
              SRDC or with other national, regional or global research platforms. Briefly describe
              the contribution of the project to the national, regional or global research agenda in
              the field of the study (max 2 pages):
            </ApText>
          </div>
          <ApText size="sm" className="leading-10 font-normal">
            {report?.researchCollaboration}
          </ApText>
        </div>
      </div>
      <ApModal width={700} title="Add Final Details" show={modal.show} onDimiss={handleDismiss}>
        <CreateReportFinalDetails reportDetail={report} onDissmiss={handleDismiss} />
      </ApModal>
    </div>
  );
};

export default FinalReportDetails;
