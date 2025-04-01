import React, { useEffect, useState } from 'react';
import { InviteTable } from './components/table';
import { useInviteState } from './context';
import {
  ApBodyContainer,
  ApButton,
  ApDateRangePicker,
  ApDropDown,
  ApModal,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '@/components';
import { FaPlus } from 'react-icons/fa6';
import { CreateInvite } from './components/create';
import { useAccessGroupState } from '../permission/group/context';
import { useOrganizationState } from '../organization/context';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import moment from 'moment';
import { BsHeadphones } from 'react-icons/bs';
import { IAccessGroup } from '../permission/group/model';

export const InvitationPage = () => {
  const [group, setGroup] = useState<IAccessGroup | null>(null);
  const { findAccessGroups, accessGroups } = useAccessGroupState();
  const { fetchOrganization, organizations } = useOrganizationState();
  const { fetchInvite, invites, totalRecords, loading, filter, modal, setModal, setFilter } =
    useInviteState();

  useEffect(() => {
    fetchInvite(filter);
    fetchOrganization({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
    findAccessGroups({});
  }, [filter]);

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : undefined;
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : undefined;
    setFilter({ ...filter, fromDate, toDate });
  };

  const handleGroupChange = (val: string | null) => {
    const selectedGroup = accessGroups.find((g) => g._id === val) || null;

    setGroup(selectedGroup);
    setFilter((prevFilter) => ({
      ...prevFilter,
      groupId: val
    }));
  };

  return (
    <>
      <ApPageHeader
        title="Invitations"
        right={
          <div className="flex items-center gap-3">
            <ApDateRangePicker
              containerClassName="cus-sm2:w-full cus-xs:col-span-2"
              date={{
                fromDate: filter?.fromDate,
                toDate: filter?.toDate
              }}
              onChange={handleDateChange}
            />
            <ApButton
              onClick={() => setModal({ show: true, type: 'create' })}
              btnType="primary"
              className="w-full"
            >
              Create Invite <FaPlus size={20} className="text-white" />
            </ApButton>
          </div>
        }
      />
      <ApBodyContainer>
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Invites"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>
        <div className="flex justify-between items-center">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-center md:justify-start gap-3">
            <ApSearchInput
              label="Search"
              placeholder="Search Invitation"
              containerClassName="!w-72"
              value={filter.keyword}
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />
            <ApDropDown
              label={group?.group || 'Group'}
              selected={group?.group}
              containerClassName="w-72 cus-sm2:w-full cus-xs:col-span-2"
              name="role"
              items={accessGroups.map((a) => ({
                value: a?._id,
                label: a?.group
              }))}
              onChange={(val) => handleGroupChange(val)}
            />
          </div>
        </div>
        <InviteTable invites={invites} loading={loading} />
      </ApBodyContainer>
      <ApModal
        width={700}
        title={modal.type === 'create' ? 'CREATE INVITE' : 'UPDATE INVITE'}
        onDimiss={() => setModal({ show: false })}
        show={modal.show}
      >
        <CreateInvite
          invite={modal.data}
          organizations={organizations}
          accessGroups={accessGroups}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </>
  );
};
