import React, { useEffect, useState } from 'react';
import { useUserState } from '@/modules/user/context';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IUser, IUserFilter } from '@/modules/user/model';
import { ApLookupInput, ApSearchInput } from '@/components';

const userColumns: any = [
  {
    title: 'Name',
    dataIndex: 'name'
  },
  {
    title: 'Phone Number',
    dataIndex: 'phoneNumber'
  },
  {
    title: 'Email',
    dataIndex: 'email'
  }
];

interface IProps {
  name: string;
  ignoreFormik?: boolean;
  users: IUser[];
  onChange?: (user: IUser) => void;
  className?: string;
}

export const ApUserSelection: React.FC<IProps> = ({ name, ignoreFormik, onChange, className }) => {
  const { fetchUsers, users, totalRecords } = useUserState();
  const [filter, setFilter] = useState<IUserFilter>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE
  });
  useEffect(() => {
    fetchUsers({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  }, []);

  useEffect(() => {
    fetchUsers({ ...filter, pageSize: DEFAULT_PAGE_SIZE });
  }, [filter]);

  const handleSearch = (val: string | undefined) => {
    if (val == undefined) return;
    setFilter({ ...filter, keyword: val });
  };

  return (
    <div className={className}>
      <ApLookupInput
        rowKey="_id"
        rowValue="name"
        placeholder="Select HOD"
        label="HOD"
        name={name}
        options={users}
        columns={userColumns}
        ignoreFormik={ignoreFormik}
        onChange={onChange}
        pagination={{
          defaultCurrent: 1,
          defaultPageSize: filter.pageSize,
          current: filter.page,
          total: totalRecords,
          onChange(page, pageSize) {
            setFilter({
              ...filter,
              page: pageSize !== filter.pageSize ? 1 : page,
              pageSize
            });
          }
        }}
        header={
          <>
            <ApSearchInput
              placeholder="Search by name, emai, phone"
              onSearchChange={handleSearch}
            />
          </>
        }
      />
    </div>
  );
};
