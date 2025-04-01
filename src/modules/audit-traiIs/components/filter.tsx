import { useState, useEffect } from 'react';
import { ApTextInput, ApSelectInputAsync, ApButton } from '@/components';
import ApDateInput from '@/components/input/DatePicker';
import { useAuditLogState } from '../context';
import { IAuditLogFilter } from '../model';
import dayjs, { Dayjs } from 'dayjs';
import { DEFAULT_PAGE_SIZE } from '@/constants';

const AuditFilter = () => {
  const { setFilter, fetchAuditLog } = useAuditLogState();

  const [filter, setLocalFilter] = useState<IAuditLogFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    date: undefined,
    reference: '',
    kind: '',
    updates: '',
    name: ''
  });

  const handleChange = (name: keyof IAuditLogFilter, value: string | Dayjs | undefined) => {
    setLocalFilter((prev) => ({ ...prev, [name]: value }));
  };
  const handleApply = () => {
    setFilter((prev) => ({
      ...prev,
      ...filter,
      page: 1
    }));

    fetchAuditLog(filter);
  };

  useEffect(() => {
    fetchAuditLog(filter);
  }, []);

  const handleReset = () => {
    const resetValues: IAuditLogFilter = {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      date: undefined,
      reference: '',
      kind: '',
      updates: '',
      name: ''
    };
    setLocalFilter(resetValues);
    setFilter(resetValues);
  };

  return (
    <div className="flex flex-col lg:flex-row items-end gap-4">
      <div className="w-full">
        <ApDateInput
          ignoreFormik
          name="date"
          label="Date"
          containerClassName="w-full"
          value={filter.date}
          onChange={(date) => handleChange('date', date ? dayjs(date) : undefined)}
        />
      </div>
      <div className="w-full">
        <ApTextInput
          ignoreFormik
          type="text"
          name="reference"
          label="Reference"
          placeholder="Enter reference"
          value={filter.reference}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('reference', e.target.value)
          }
        />
      </div>
      <div className="w-full">
        <ApSelectInputAsync
          ignoreFormik
          label="Module"
          name="kind"
          labelKey="module"
          valueKey="kind"
          cacheOptions={false}
          placeholder="Select Kind"
          value={filter.kind}
          onChange={(selected) => handleChange('kind', selected?.kind || '')}
        />
      </div>
      <div className="w-full">
        <ApTextInput
          ignoreFormik
          type="text"
          name="updates"
          label="Changes"
          placeholder="Changes 1"
          value={filter.updates}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('updates', e.target.value)
          }
        />
      </div>
      <div className="w-full">
        <ApTextInput
          ignoreFormik
          type="text"
          name="name"
          label="User Name"
          placeholder="Enter User name"
          value={filter.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleChange('name', e.target.value)
          }
        />
      </div>
      <div className="ml-3 flex gap-2 w-full">
        <ApButton title="Apply" type="button" onClick={handleApply} />
        <ApButton title="Reset" type="button" onClick={handleReset} btnType="outline" />
      </div>
    </div>
  );
};

export default AuditFilter;
