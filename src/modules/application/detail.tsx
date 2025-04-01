import { ApButton, ApConfirm, ApLoader, ApModal, ApText, ApTextInput } from '@/components';
import ApTable from '@/components/table';
import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';
import { IActivity } from '../activity/model';
import { IBudget } from '../budget/model';
import CommentIcon from '../comment/components/comment';
import { useCommentState } from '../comment/context';
import { IPublication } from '../publication/model';
import ApplicationReports from '../report';
import { CreateReport } from '../report/components/create';
import { IReviewer } from '../reviewer/model';
import { ITeamMember } from '../team-members/model';
import { ActivityItem } from './components/activity';

import { ApDateTime } from '@/components/date';
import { TableColumnsType } from 'antd';
import ApplicationExtensionPage from '../extenstion/application';
import { CreateExtenstion } from '../extenstion/components/create';
import FinalReportApplication from '../report/components/finalReportApplicaton';
import { useReportState } from '../report/context';
import ReportBudget from '../report/item/components/budget';
import ReportExpense from '../report/item/components/expense';
import { useApplicationState } from './context';
import { ApplicationStatus, getStatusClassName, IApplication } from './model';
import { useActivityState } from '../activity/context';

interface IProps {
}

export default function ApplicationDetailPage({ }: IProps) {
  const [current, setCurrent] = useState('details');
  const { setModal, modal, fetchReport, filter, loading } = useReportState();
  const { updateStatus, application } = useApplicationState();
  const { fetchComments } = useCommentState();
  const [statusComment, setStatusComment] = useState('');

  useEffect(() => {
    fetchComments({ refId: application?._id });
    fetchReport({ ...filter, applicationId: application?._id });
  }, [filter]);

  const RenderStatusComment = () => {
    return <div className='mt-5'>
      <ApTextInput type="textarea" label="Comment" ignoreFormik onChange={(val: any) => {
        setStatusComment(val);
      }} />
    </div>
  }

  const handleUpdateStatus = (status: ApplicationStatus) => {
    ApConfirm({
      title: "Confirmation!",
      message: `Update application status to ${status}`,
      children: <RenderStatusComment />,
      callback(val) {
        if (val) {
          updateStatus({ _id: application._id, status, comment: statusComment });
        }
      },
    });
  }


  const RenderDetailTabContent = () => {

    const { formatActivities } = useActivityState();

    return <div>
      <p className="text-center my-10 text-xl text-primary font-bold">
        APPLICATION REQUIREMENTS
      </p>
      <div className="flex flex-col gap-10 ">
        <Details application={application} />
        <TeamMembers members={application?.members} />
        <Publications publications={application?.publications} />
        <Activities activities={formatActivities(application?.activities)} />
        <Declaration application={application} />
        <Reviewers application={application} />
      </div>
    </div>
  }

  const RenderFinalReportContent = () => (
    <>
      <p className="text-center my-10 text-xl text-primary font-bold">
        FINAL REPORT
      </p>
      {application?.finalReport?._id ? (
        <div className="mt-10">
          <FinalReportApplication application={application} />
        </div>
      ) : (
        <ApText>No Final Report Application</ApText>
      )}
    </>

  )

  const RenderReportTabContent = () => (
    <>
      <p className="text-center my-10 text-xl text-primary font-bold">
        PROGRESS REPORT
      </p>
      {loading ? (
        <div className="">
          <ApLoader />
        </div>
      ) : (
        <ApplicationReports application={application} />
      )}
    </>
  )

  const RenderExtensionTabContent = () => (
    <ApplicationExtensionPage application={application} />
  )

  const RenderBudgetAndExpenses = () => {

    return <>
      <p className="text-center my-10 text-xl text-primary font-bold">
        BUDGET & EXPENSES
      </p>


      <div className="border border-primary overflow-hidden rounded-lg mb-10">
        <div className="bg-primary text-white px-5 py-3 font-bold text-xl flex items-center justify-between">
          BUDGETS
        </div >
        <ReportBudget
          title='Budget'
          reportId={""}
          applicationId={application?._id}
          budgets={application.budgets}
        />
      </div>


      <div className="border border-primary overflow-hidden rounded-lg">
        <div className="bg-primary text-white px-5 py-3 font-bold text-xl flex items-center justify-between">
          EXPENSES
        </div >
        <ReportExpense
          title='Expenses'
          reportId={""}
          applicationId={application?._id}
          expenses={application.expenses}
        />
      </div>
    </>

  }

  const RenderTabContent = () => {

    switch (current) {
      case 'details':
        return <RenderDetailTabContent />;
      case 'report':
        return <RenderReportTabContent />;
      case 'extension':
        return <RenderExtensionTabContent />;
      case 'final_report':
        return <RenderFinalReportContent />;
      case 'expenses':
        return <RenderBudgetAndExpenses />;
      default:
        return null;
    }

  }



  const RnderTabActions = () => {

    switch (current) {
      case 'report':
        return <ApButton
          className="rounded-md"
          onClick={() => setModal({ show: true, type: 'create' })}
          btnType="primary"
        >
          New Report
          <FaPlus size={20} className="text-white" />
        </ApButton>;
      case 'extension':
        return !application?.hasExtension && <ApButton
          className="rounded-md"
          onClick={() => setModal({ show: true, type: 'extension' })}
          btnType="primary"
        >
          New Extenstion
          <FaPlus size={20} className="text-white" />
        </ApButton>;
      case 'final_report':
        return application?.finalReport?._id ? null : <ApButton
          className="rounded-md"
          onClick={() => setModal({ show: true, type: 'create' })}
          btnType="primary"
        >
          Start Final Report
          <FaPlus size={20} className="text-white" />
        </ApButton>;
      default:
        return null;
    }
  }


  return (
    <div className="p-10">
      <div className="border rounded-lg p-5">
        <div className="flex justify-between">
          <div className="gap-1">
            <p>Grant Name:</p>
            <p className="text-primary font-semibold">{application?.grant?.name}</p>
          </div>


          <div>
            <p className="">From Date: </p>
            <ApDateTime date={application?.grant?.fromDate} />
          </div>


          <div>
            <p className="">To Date:</p>
            <ApDateTime date={application?.grant?.toDate} />
          </div>

          <div className="flex gap-1">
            <p>Application Status:</p>
            <p className="text-green-500 font-semibold">{application?.status}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-5">
          {application?.applicationStatuses?.map((status, i) => <ApButton key={i} className={`!rounded-full px-5 ${getStatusClassName(status)}`} title={status} onClick={() => handleUpdateStatus(status as any)} />)}
        </div>

        <p className="leading-loose mt-3">
          <h3 className="text-primary font-semibold">Detail</h3>
          {application?.grant?.description}</p>
      </div>

      <div>
        <div className="flex justify-between mt-10">
          <div className="border border-primary flex">
            <button
              onClick={() => setCurrent('details')}
              className={`${current == 'details' ? 'bg-primary text-white' : 'text-primary bg-white'} px-5 py-3`}
            >
              Application
            </button>
            <button
              onClick={() => setCurrent('report')}
              className={`${current == 'report' ? 'bg-primary text-white' : 'text-primary bg-white'} px-5 py-3 border-x border-x-primary`}
            >
              Progress Report
            </button>
            <button
              onClick={() => setCurrent('extension')}
              className={`${current == 'extension' ? 'bg-primary text-white' : 'text-primary bg-white'} px-5 py-3 border-x border-x-primary`}
            >
              Vote Virement
            </button>
            <button
              onClick={() => setCurrent('expenses')}
              className={`${current == 'expenses' ? 'bg-primary text-white' : 'text-primary bg-white'} px-5 py-3 border-x border-x-primary`}
            >
              Budget & Expenses
            </button>
            <button
              onClick={() => setCurrent('final_report')}
              className={`${current == 'final_report' ? 'bg-primary text-white' : 'text-primary bg-white'} px-5 py-3`}
            >
              Final Report
            </button>
          </div>

          <RnderTabActions />

        </div>

        <RenderTabContent />

      </div>

      <ApModal
        title={modal.type === 'create' ? 'CREATE REPORT' : 'UPDATE REPORT'}
        onDimiss={() => setModal({ show: false })}
        show={modal.show}
      >

        {modal.type === 'create' &&
          <CreateReport
            applicationId={application?._id}
            report={modal.data}
            onDissmiss={() => setModal({ show: false })}
            reportType={current}
          />}

        {modal.type === 'extension' &&
          <CreateExtenstion applicationId={application?._id} onDissmiss={() => setModal({ show: false })} />}
      </ApModal>
    </div>
  );
}

const Details = ({ application }: { application: IApplication }) => {
  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Details</div>

      <div className="flex flex-col gap-5 p-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Proposal Title</p>
            <CommentIcon
              refId={application._id}
              propName="proposalTitle"
              comments={application.comments}
            />
          </div>
          <p className="font-light text-sm">{application?.proposalTitle}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Research Focus</p>
            <CommentIcon
              refId={application._id}
              propName="researchFocus"
              comments={application.comments}
            />
          </div>
          <p className="font-light text-sm leading-loose">{application?.researchFocus}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Executive Summary </p>
            <CommentIcon
              refId={application._id}
              propName="executiveSummary"
              comments={application.comments}
            />
          </div>
          <p className="font-light text-sm leading-loose">{application?.executiveSummary}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Design And Method</p>
            <CommentIcon
              refId={application._id}
              propName="designAndMethod"
              comments={application.comments}
            />
          </div>
          <p className="font-light text-sm leading-loose">{application?.designAndMethod}</p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <p className="font-medium">Rational And Background</p>
            <CommentIcon
              refId={application._id}
              propName="rationalAndBackground"
              comments={application.comments}
            />
          </div>
          <p className="font-light text-sm leading-loose">{application?.rationalAndBackground}</p>
        </div>
      </div>
    </div>
  );
};

const TeamMembers = ({ members }: { members: ITeamMember[] }) => {
  const columns: any = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: any, { _id, comments }: ITeamMember) => {
        return (
          <>
            {name}
            <CommentIcon refId={_id} propName="name" comments={comments} />
          </>
        );
      }
    },
    {
      title: 'Team Member Role',
      dataIndex: 'role',
      key: 'role',
      render: (val: any) => val?.name
    }
  ];

  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Team Members</div>

      <div className="flex flex-col gap-5 p-5">
        <ApTable
          columns={columns}
          dataSource={members?.map((item: any, i: any) => ({
            ...item,
            index: i + 1
          }))}
        />
      </div>
    </div>
  );
};

const Publications = ({ publications }: { publications: IPublication[] }) => {
  const columns: any = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (title: any, { _id, comments }: IPublication) => {
        return (
          <>
            {title}
            <CommentIcon refId={_id} propName="title" comments={comments} />
          </>
        );
      }
    },
    {
      title: 'Tier',
      dataIndex: 'tier',
      key: 'tier'
    },
    {
      title: 'Digital Object identifier',
      dataIndex: 'doi',
      key: 'doi'
    },
    {
      title: 'Paper Type',
      dataIndex: 'paperType',
      key: 'paperType',
      render: (val: any) => val?.name
    }
  ];

  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Publications</div>

      <div className="flex flex-col gap-5 p-5">
        <ApTable
          columns={columns}
          dataSource={publications?.map((item: any, i: any) => ({
            ...item,
            index: i + 1
          }))}
        />
      </div>
    </div>
  );
};

const Activities = ({ activities }: { activities: IActivity[] }) => {
  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Activities</div>

      <div className="flex flex-col gap-5 p-5">
        {activities?.length == 0 ? (
          <div className="text-sm flex justify-center items-center p-10">
            <p>No Data</p>
          </div>
        ) : (
          activities?.map((milestone) => <ActivityItem key={milestone?._id} item={milestone} />)
        )}
      </div>
    </div>
  );
};

// const Budget = ({ budgets }: { budgets: IBudget[] }) => {
//   const columns: any = [{ title: 'Year', dataIndex: 'year', key: 'year' }];

//   const expandColumns: TableColumnsType<any> = [
//     {
//       title: 'Vote Head Name',
//       dataIndex: 'name',
//       key: 'name',
//       render: (val: any, record: any) => record?.voteHead?.name
//     },
//     {
//       title: 'Vote Head Amount',
//       dataIndex: 'amount',
//       key: 'amount',
//       render: (val: any, record: any) => record?.voteHead?.amount
//     },
//     { title: 'Description', dataIndex: 'description', key: 'description' }
//   ];

//   const expandedRowRender = (budget: IBudget) => (
//     <ApTable columns={expandColumns} dataSource={budget?.voteHeads} pagination={false} />
//   );

//   return (
//     <div className="border border-primary overflow-hidden rounded-lg">
//       <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Budget</div>

//       <div className="p-5">
//         <ApTable expandable={{ expandedRowRender }} columns={columns} dataSource={budgets} />
//       </div>

//       {/* <div className="flex flex-col gap-5 p-5">
//         {budgets?.length == 0 ? (
//           <div className="text-sm flex justify-center items-center p-10">
//             <p>No Data</p>
//           </div>
//         ) : (
//           budgets?.map((item, index: number) => (
//             <div key={index}>
//               <div className="flex justify-between items-center">
//                 <p className="mb-3">{item?.year}</p>
//               </div>

//               {item?.voteHeads?.map((budgetItem, i: number) => (
//                 <div key={i} className="border-b pb-3 mb-3 font-light text-sm">
//                   <p>
//                     {budgetItem?.voteHead?.name} - {budgetItem?.voteHead?.amount}
//                   </p>
//                   <p>{budgetItem?.description}</p>
//                 </div>
//               ))}
//             </div>
//           ))
//         )}
//       </div> */}
//     </div>
//   );
// };

const Declaration = ({ application }: { application: IApplication }) => {
  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Declaration</div>

      <div className="flex flex-col gap-5 p-5">
        <div>
          <div className='flex items-center gap-2 mb-2'>
            <p className="font-medium">Additional Comment</p>
            <CommentIcon refId={application._id} propName="additionalComments" comments={[]} />
          </div>
          <p className="font-light text-sm">{application?.additionalComments || '----'}</p>
        </div>

        <div>
          <div className='flex items-center gap-2 mb-2'>
            <p className="font-medium">Revision</p>
            <CommentIcon refId={application._id} propName="revision" comments={[]} />
          </div>
          <p className="font-light text-sm">{application?.revision || '----'}</p>
        </div>
      </div>
    </div>
  );
};

const Reviewers = ({ application }: { application: IApplication }) => {
  const reviewers = application?.reviewers;

  if (!application.showReviewers) {
    return null;
  }

  const columns: any = [
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (val: any, { _id, comments }: IReviewer) => {
        return (
          <>
            {val?.firstName} {val?.lastName}
            <CommentIcon refId={_id} propName="name" comments={comments} />
          </>
        );
      }
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment'
    }
  ];

  return (
    <div className="border border-primary overflow-hidden rounded-lg">
      <div className="bg-primary text-white px-5 py-3 font-bold text-xl">Reviewers</div>

      <div className="flex flex-col gap-5 p-5">
        <ApTable
          columns={columns}
          dataSource={reviewers?.map((item: any, i: any) => ({
            ...item,
            index: i + 1
          }))}
        />
      </div>
    </div>
  );
};
