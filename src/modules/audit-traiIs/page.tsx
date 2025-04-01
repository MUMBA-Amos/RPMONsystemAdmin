import React, { useEffect } from 'react';
import { useAuditLogState } from './context';
import { AuditLogTable } from './components/table';
import { ApBodyContainer, ApDateRangePicker, ApPageHeader } from '@/components';
import moment from 'moment';
import AuditFilter from './components/filter';

export const AuditLogPage = () => {
  const { fetchAuditLog, auditLogs, loading, filter, setFilter } = useAuditLogState();

  useEffect(() => {
    fetchAuditLog(filter);
  }, [filter]);

  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : undefined;
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : undefined;
    setFilter({ ...filter, fromDate, toDate });
  };

  return (
    <>
      <ApPageHeader
        title="Audit Trails"
        right={
          <div className="flex gap-5 justify-end">
            <ApDateRangePicker
              date={{
                fromDate: filter?.fromDate,
                toDate: filter?.toDate
              }}
              onChange={handleDateChange}
            />
          </div>
        }
      />
      <ApBodyContainer className="flex flex-col gap-5">
        <AuditFilter />
        <AuditLogTable auditLogs={auditLogs} loading={loading} />
      </ApBodyContainer>
    </>
  );
};
