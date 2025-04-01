import { ApDeleteRowIcon, ApEditRowIcon } from '@/components';
import { useActivityState } from '@/modules/activity/context';
import ApplicationReviewer from '@/modules/application/create/components/reviewer';
import { IApplication } from '@/modules/application/model';
import { IProfile } from '@/modules/profile/model';
import { useState } from 'react';
import { GoTriangleDown, GoTriangleUp } from 'react-icons/go';
import { useReportState } from '../context';
import { IReport } from '../model';
import ReportActivity from './components/activity';
import ReportBudget from './components/budget';
import ReportExpense from './components/expense';
import ReportPublication from './components/publication';
import ReportResearch from './components/research';
import ReportResearchers from './components/researcher';
import FinalReportDetails from './finalReportComponent/finalDetails';
import FinalReportFormDetails from './finalReportComponent/formDetail';
import FinalReportGrantDetails from './finalReportComponent/grantDetails';
import FinalReportPatent from './finalReportComponent/patent';
import FinalReportResearcher from './finalReportComponent/research';
import FinalReportSubmission from './finalReportComponent/submission';

interface IProps {
  report: IReport;
  isFirst?: boolean;
  isFinalReport?: boolean;
  applicationId: string;
  application?: IApplication;
}

export default function ReportItem({
  isFirst,
  report,
  applicationId,
  isFinalReport,
  application
}: IProps) {
  const { setModal, deleteReport, loading, fetchReport, filter } = useReportState();
  const [openItem, setOpenItem] = useState(isFirst ? true : false);
  const { formatActivities } = useActivityState();

  const handleDelete = (id: string) => {
    deleteReport(id).then(() => {
      fetchReport(filter);
    });
  };

  const handleEdit = (data: any) => {
    setModal({ show: true, type: 'update', data });
  };

  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl flex items-center justify-between">
        {report?.title}

        <div className="flex items-center gap-3">
          <ApEditRowIcon
            iconClassName="!text-white"
            onClick={() => handleEdit?.(report)}
            tooltipTitle={`Edit Report`}
          />
          <ApDeleteRowIcon
            iconClassName="!text-white"
            onConfirm={() => handleDelete?.(report?._id)}
            tooltipTitle={`Delete Report`}
          />

          <button onClick={() => setOpenItem(!openItem)}>
            {openItem ? (
              <GoTriangleUp color="#fff" size={30} />
            ) : (
              <GoTriangleDown color="#fff" size={30} />
            )}
          </button>
        </div>
      </div>

      {isFinalReport && openItem ? (
        <div className="flex flex-col gap-4">
          <FinalReportResearcher
            researcher={application?.researcher as IProfile}
            reportId={report?._id}
          />
          <FinalReportGrantDetails application={application as IApplication} />
          <FinalReportFormDetails application={application as IApplication} />
          <FinalReportDetails report={report as IReport} />
          <ReportPublication
            title='Final Publication'
            reportId={report?._id}
            applicationId={applicationId}
            publications={report?.publications}
          />
          <FinalReportPatent />
          <ReportActivity
            title='Final Activities'
            reportId={report?._id}
            applicationId={applicationId}
            activities={formatActivities(report?.activities)}
          />

          <ReportActivity
            title='Final Milestone'
            reportId={report?._id}
            applicationId={applicationId}
            activities={report?.milestones}
          />

          <ReportBudget
            title='Final Budget'
            reportId={report?._id}
            applicationId={applicationId}
            budgets={report?.budgets}
          />

          <ReportExpense
            title='Final Expenses'
            reportId={report?._id}
            applicationId={applicationId}
            expenses={report?.expenses}
          />

          <FinalReportSubmission finalReport={report} />


          {report?.showEndorsement &&
            <div className='flex flex-col gap-5'>
              <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
                <p>Final Endorsement</p>
              </div>
              <div className='p-5 '>
                <ApplicationReviewer refId={report?._id} reviewers={report.reviewers} application={application as IApplication} />
              </div>
            </div>}

          {report?.showApproval &&
            <div className='flex flex-col gap-5'>
              <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
                <p>Final Approval</p>
              </div>
              <div className='p-5 '>
                <ApplicationReviewer refId={report?._id} reviewers={report.approvers} application={application as IApplication} />
              </div>
            </div>}
        </div>
      ) : (
        <>
          {openItem && (
            <div className="flex flex-col gap-5">
              <ReportResearch
                reportId={report?._id}
                applicationId={applicationId}
                research={report?.research}
              />
              <ReportPublication
                reportId={report?._id}
                applicationId={applicationId}
                publications={report?.publications}
              />
              <ReportActivity
                reportId={report?._id}
                applicationId={applicationId}
                activities={formatActivities(report?.activities)}
              />
              <ReportResearchers reportId={report?._id} researchers={report?.researchers} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
