import { ApButton } from '@/components';
import ApTable from '@/components/table';
import { useActivityState } from '@/modules/activity/context';
import { useBudgetState } from '@/modules/budget/context';
import { usePublicationState } from '@/modules/publication/context';
import { useTeamMemberState } from '@/modules/team-members/context';
import React from 'react';
import { ActivityItem } from '../../components/activity';
import { IBudgetVoteHead } from '@/modules/budget/model';

export default function GrantApplicationSummary({
  details,
  declaration,
  loading,
  onBack,
  onNext
}: any) {
  const { teamMembers } = useTeamMemberState()
  const { publications } = usePublicationState()
  const { activitys } = useActivityState()
  const { budgets } = useBudgetState()

  return (
    <div>
      <div className="flex flex-col gap-10">
        <Details details={details} />
        <TeamMembers members={teamMembers} />
        <Publication publications={publications} />
        <Milestones milestones={activitys} />
        <Budget budgets={budgets} />
        <Declaration declaration={declaration} />
      </div>

      <div className="flex justify-between mt-10 border-t pt-5">
        <ApButton
          btnType="outline"
          title="Back"
          className="!w-[200px] !py-3"
          type="button"
          onClick={onBack}
          disabled={loading}
        />
        <ApButton loading={loading} onClick={onNext} title="Submit" className="!w-[200px] !py-3" />
      </div>
    </div>
  );
}

const Details = ({ details }: any) => {
  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white">Details</div>

      <div className="flex flex-col gap-5 mt-5">
        <div>
          <p className="font-medium mb-2">Proposal Title</p>
          <p className="font-light text-sm">{details?.proposalTitle}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Research Focus</p>
          <p className="font-light text-sm leading-loose">{details?.researchFocus}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Executive Summary</p>
          <p className="font-light text-sm leading-loose">{details?.executiveSummary}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Design And Method</p>
          <p className="font-light text-sm leading-loose">{details?.designAndMethod}</p>
        </div>

        <div>
          <p className="font-medium mb-2">Rational And Background</p>
          <p className="font-light text-sm leading-loose">{details?.rationalAndBackground}</p>
        </div>
      </div>
    </div>
  );
};

const TeamMembers = ({ members }: any) => {
  const columns: any = [
    {
      title: 'No.',
      dataIndex: 'index',
      key: 'index'
    },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Team Member Role', dataIndex: 'role', key: 'role', render: (val: any) => val?.name },
  ];

  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white mb-5">Team Members</div>
      <ApTable
        columns={columns}
        dataSource={members?.map((item: any, i: any) => ({
          ...item,
          index: i + 1
        }))}
      />
    </div>
  );
};

const Publication = ({ publications }: any) => {
  const columns: any = [
    { title: 'No.', dataIndex: 'index', key: 'index' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Paper Type',
      dataIndex: 'paperType',
      key: 'paperType',
      render: (val: any) => val?.label
    },
    { title: 'Tier', dataIndex: 'tier', key: 'tier' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Publication Year', dataIndex: 'year', key: 'year' },
    { title: 'Digital Object Identifier', dataIndex: 'doi', key: 'doi' },
    { title: 'Article URL', dataIndex: 'url', key: 'url' },
    { title: 'Submitted To', dataIndex: 'submittedTo', key: 'submittedTo' }
  ];

  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white mb-5">Publication</div>
      <ApTable
        columns={columns}
        dataSource={publications?.map((item: any, i: number) => ({ ...item, index: i + 1 }))}
      />
    </div>
  );
};

const Milestones = ({ milestones }: any) => {
  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white mb-5">Milestones</div>

      <div className="flex flex-col gap-14">
        {milestones?.length == 0 ? (
          <div className="text-sm flex justify-center items-center p-10">
            <p>No Data</p>
          </div>
        ) : (
          milestones?.map((milestone: any, i: number) => (
            <ActivityItem
              key={milestone?._id}
              item={milestone}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Budget = ({ budgets }: any) => {
  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white mb-5">Budget</div>
      <div className="flex flex-col gap-5">
        {budgets?.length == 0 ? (
          <div className="text-sm flex justify-center items-center p-10">
            <p>No Data</p>
          </div>
        ) : (
          budgets?.map((item: any, index: number) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <p className="mb-3">
                  {item?.year}
                </p>
              </div>

              {item?.voteHeads?.map((budgetItem: IBudgetVoteHead, i: number) => (
                <div key={i} className="border-b pb-3 mb-3 font-light text-sm">
                  {budgetItem?.voteHead && (
                    <p>
                      {budgetItem?.voteHead?.name} - {budgetItem?.voteHead?.amount}
                    </p>
                  )}
                  <p>{budgetItem?.description}</p>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const Declaration = ({ declaration }: any) => {
  return (
    <div>
      <div className="bg-primary w-full px-5 py-3 text-white">Declaration</div>

      <div className="flex flex-col gap-5 mt-5">
        <div>
          <p className="font-medium mb-2">Additional Comment</p>
          <p className="font-light text-sm">{declaration?.additionalComments}</p>
        </div>
      </div>
    </div>
  );
};
