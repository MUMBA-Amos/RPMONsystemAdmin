import {
  ApBodyContainer,
  ApDateRangePicker,
  ApPageHeader,
  ApSearchInput,
  ApSummaryCard,
  ApSummaryContainer
} from '@/components';
import moment from 'moment';
import { useEffect } from 'react';
import { UsersTable } from './components/table';
import { useUserState } from './context';
import { BsHeadphones } from 'react-icons/bs';

export const UsersPage = () => {
  const { loading, users, totalRecords, filter, fetchUsers, setFilter } = useUserState();

  useEffect(() => {
    fetchUsers(filter);
  }, [filter]);

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : undefined;
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : undefined;
    setFilter({ ...filter, fromDate, toDate });
  };

  return (
    <>
      <ApPageHeader
        title="Users"
        right={
          <ApDateRangePicker
            containerClassName="cus-sm2:w-full cus-xs:col-span-2"
            date={{
              fromDate: filter?.fromDate,
              toDate: filter?.toDate
            }}
            onChange={handleDateChange}
          />
        }
      />
      <ApBodyContainer>
        <ApSummaryContainer className="cus-sm:grid cus-sm:grid-cols-2 cus-xs:!gap-3">
          <ApSummaryCard
            value={totalRecords}
            title="Total Users"
            icon={<BsHeadphones color="#b6b30d" size={20} />}
            className="!w-[14rem]"
          />
        </ApSummaryContainer>
        <div className="flex justify-between items-center">
          <div className="flex items-end justify-start gap-3 mb-3">
            <ApSearchInput
              placeholder="Search Users"
              containerClassName="!w-72"
              value={filter.keyword}
              onSearchChange={(keyword) => setFilter({ ...filter, keyword })}
            />
          </div>
        </div>
        <UsersTable users={users} loading={loading} />
      </ApBodyContainer>
    </>
  );
};
