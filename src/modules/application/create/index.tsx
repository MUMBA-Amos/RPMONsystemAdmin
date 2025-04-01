import { useActivityState } from '@/modules/activity/context';
import { useBudgetState } from '@/modules/budget/context';
import { IGrant } from '@/modules/grant/model';
import { usePublicationState } from '@/modules/publication/context';
import { useReviewerState } from '@/modules/reviewer/context';
import { useTeamMemberState } from '@/modules/team-members/context';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useApplicationState } from '../context';
import GrantApplicationBudget from './components/budget';
import GrantApplicationDecleration from './components/decleration';
import GrantApplicationDetail from './components/detail';
import GrantApplicationMilestones from './components/milestones';
import GrantApplicationPublication from './components/publication';
import ApplicationReviewer from './components/reviewer';
import GrantApplicationSummary from './components/summary';
import GrantApplicationTab from './components/tab';
import GrantApplicationTeamMember from './components/team-member';
import { ApDateTime } from '@/components/date';

type GrantApplicationSection =
  | 'Detail'
  | 'Team Members'
  | 'Publication'
  | 'Milestones & Activities'
  | 'Budget'
  | 'Declaration'
  | 'Reviewers'
  | 'Summary';

export default function GrantApplication({ grant }: { grant?: IGrant }) {
  const [current, setCurrent] = useState<GrantApplicationSection>('Detail');
  const [declaration, setDeclaration] = useState<any>();
  const [details, setDetails] = useState<any>();
  const [files, setFiles] = useState([]);
  const [additionalFiles, setAdditionalFiles] = useState([]);
  const { application, updating } = useApplicationState();
  const router = useRouter();
  const { setTeamMembers } = useTeamMemberState();
  const { setPublications } = usePublicationState();
  const { setActivitys } = useActivityState();
  const { setBudgets } = useBudgetState();
  const { setReviewers } = useReviewerState();

  const handleSubmit = () => {
    router.push('/applications');
  };

  useEffect(() => {
    if (application) {
      setDetails({
        proposalTitle: application?.proposalTitle,
        researchFocus: application.researchFocus,
        executiveSummary: application.executiveSummary,
        designAndMethod: application.designAndMethod,
        rationalAndBackground: application.rationalAndBackground,
        comment: application?.comment
      });
      setDeclaration({
        additionalComments: application?.additionalComments
      });

      setTeamMembers(application?.members);
      setPublications(application?.publications);
      setActivitys(application?.activities);
      setBudgets(application?.budgets);
      setReviewers(application?.reviewers);
    }
  }, [application]);

  // Replace the hard-coded array with a computed array
  const tabItems = React.useMemo(() => {
    const baseTabs = ['Detail', 'Team Members', 'Publication', 'Milestones & Activities', 'Budget', 'Declaration'];


    baseTabs.push('Summary');

    // Add Reviewers tab only if showReviewer is true
    if (application?.showReviewers) {
      baseTabs.push('Reviewers');
    }

    return baseTabs;
  }, [application?.showReviewers]);

  return (
    <div className="p-10">
      <div className="border rounded-lg p-5">
        <div className="flex justify-between">
          <div className="gap-1">
            <p>Grant Name:</p>
            <p className="text-primary font-semibold">{grant?.name || application?.grant?.name}</p>
          </div>


          <div>
            <p className="">From Date: </p>
            <ApDateTime date={grant?.fromDate || Date.now()} />
          </div>


          <div>
            <p className="">To Date:</p>
            <ApDateTime date={grant?.toDate || Date.now()} />
          </div>

          <div className="gap-1">
            <p>Grant Status:</p>
            <p className="text-green-500 font-semibold">{application?.status}</p>
          </div>
        </div>

        <p className="leading-loose mt-3">
          <h3 className="text-primary font-semibold">Detail</h3>
          {grant?.description || application?.grant?.description}
        </p>
      </div>

      <div className="border rounded-lg p-5 mt-5">
        <GrantApplicationTab setCurrent={setCurrent} current={current} items={tabItems} />


        <div className="mt-5">
          {current == 'Detail' && (
            <GrantApplicationDetail
              grantId={grant?._id || application?.grantId}
              details={details}
              setDetails={setDetails}
              onNext={() => setCurrent('Team Members')}
              files={files}
              setFiles={setFiles}
              applicationId={application?._id}
            />
          )}
          {current == 'Team Members' && (
            <GrantApplicationTeamMember
              applicationId={application?._id}
              onNext={() => setCurrent('Publication')}
              onBack={() => setCurrent('Detail')}
            />
          )}
          {current == 'Publication' && (
            <GrantApplicationPublication
              applicationId={application?._id}
              onNext={() => setCurrent('Milestones & Activities')}
              onBack={() => setCurrent('Team Members')}
            />
          )}
          {current == 'Milestones & Activities' && (
            <GrantApplicationMilestones
              applicationId={application?._id}
              onNext={() => setCurrent('Budget')}
              onBack={() => setCurrent('Publication')}
            />
          )}
          {current == 'Budget' && (
            <GrantApplicationBudget
              applicationId={application?._id}
              onNext={() => setCurrent('Declaration')}
              onBack={() => setCurrent('Milestones & Activities')}
            />
          )}
          {current == 'Declaration' && (
            <GrantApplicationDecleration
              applicationId={application?._id}
              declaration={declaration}
              onNext={() => setCurrent('Summary')}
              onBack={() => setCurrent('Budget')}
              additionalFiles={additionalFiles}
              setAdditionalFiles={setAdditionalFiles}
            />
          )}

          {current == 'Summary' && (
            <GrantApplicationSummary
              details={details}
              declaration={declaration}
              loading={updating}
              onNext={handleSubmit}
              onBack={() => setCurrent('Declaration')}
            />
          )}

          {current == 'Reviewers' && (
            <ApplicationReviewer
              reviewers={application?.reviewers}
              application={application}
            />
          )}
        </div>
      </div>
    </div>
  );
}
