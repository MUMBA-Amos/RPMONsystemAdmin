import { Table } from 'antd';
import type { TablePaginationConfig, TableProps } from 'antd/es/table';
import React, { Dispatch } from 'react';

import { ThemeConfig } from 'antd/es/config-provider';
import Link from 'next/link';
import { AiFillDelete } from 'react-icons/ai';
import { FaEdit } from 'react-icons/fa';
import { FaArrowRight } from 'react-icons/fa6';
import { MdOutlineAdd } from 'react-icons/md';
import { ApButton } from '../button/button';
import { ApTooltip } from '../container';
import { ApAccessGuard } from '../guard';
import { ApConfirmPopover } from '../modal/popover';

export interface IApTalbeProps extends TableProps<any> {
  theme?: ThemeConfig | undefined;
  headerBg?: string;
  hiddenColumns?: string[];
}

const ApTable: React.FC<IApTalbeProps> = (props: IApTalbeProps) => {
 
  return (
    <Table
      showHeader
      pagination={false}
      scroll={{ x: true }}
      className="h-full"
      rowKey={(record: any) => record._id || record.id}
      {...props}
      columns={props?.columns}
    />
  );
};

export default ApTable;

interface IProps2 {
  href: string;
  onClick?: () => void;
}
export const ApViewDetailBtn: React.FC<IProps2> = ({ href, onClick }) => {
  return (
    <ApTooltip title="View Detail" className="">
      <Link href={href} onClick={onClick} target="_blank">
        <div className="flex items-center">
          <p className="text-primary font">View Detail</p>
          <FaArrowRight size={15} className="ml-2 text-2xl cursor-pointer text-primary" />
        </div>
      </Link>
    </ApTooltip>
  );
};

export const ApDeleteRowIcon: React.FC<{
  popoverTitle?: string;
  tooltipTitle?: string;
  onConfirm: () => void;
  permission?: { module: string; action: string };
}> = ({ popoverTitle, tooltipTitle, onConfirm, permission }) => {
  const renderButton = () => (
    <ApConfirmPopover title={popoverTitle || 'Delete'} onConfirm={onConfirm}>
      <ApTooltip title={tooltipTitle || 'Delete'}>
        <AiFillDelete className="text-xl text-red-500 cursor-pointer" />
      </ApTooltip>
    </ApConfirmPopover>
  );

  if (permission)
    return (
      <ApAccessGuard module={permission?.module} action={permission?.action}>
        {renderButton()}
      </ApAccessGuard>
    );

  return renderButton();
};

export const ApEditRowIcon: React.FC<{
  popoverTitle?: string;
  tooltipTitle?: string;
  onClick: () => void;
  permission?: { module: string; action: string };
}> = ({ popoverTitle, tooltipTitle, onClick, permission }) => {
  const renderButton = () => (
    <div role="button" onClick={onClick}>
      {/* <ApTooltip title={tooltipTitle || 'Edit'}> */}
      <FaEdit className="text-xl text-blue-400 cursor-pointer" />
      {/* </ApTooltip> */}
    </div>
  );

  if (permission) {
    return (
      <ApAccessGuard module={permission?.module} action={permission?.action}>
        {renderButton()}
      </ApAccessGuard>
    );
  }

  return renderButton();
};

export const ApAddRowButton: React.FC<{ title?: string; onClick: () => void }> = ({
  title,
  onClick
}) => {
  return (
    <div
      role="button"
      className="flex justify-center p-2 mt-5 border border-dotted"
      onClick={onClick}
    >
      <ApButton type="button" btnType="outline" className="!border-none text-gray-300">
        <MdOutlineAdd />
        {title || 'Add Transaction'}
      </ApButton>
    </div>
  );
};

interface IPage {
  filter: {
    page: number;
    pageSize: number;
    [key: string]: any;
  } | null;
  totalRecords: number;
  setFilter?: Dispatch<any>;
  onChange?: (page: number, pageSize: number) => void;
}

export const mapTablePagination = (pg: IPage): false | TablePaginationConfig | undefined => {
  if (!pg) return false;

  return {
    defaultCurrent: 1,
    defaultPageSize: pg?.filter?.pageSize,
    current: pg?.filter?.page,
    total: pg?.totalRecords,
    showTotal: (total) => `Total ${total} items`,
    onChange: (page, pageSize) => {
      pg.setFilter &&
        pg.setFilter({
          ...pg.filter,
          page: pageSize !== pg.filter?.pageSize ? 1 : page,
          pageSize
        });
      pg.onChange && pg.onChange(page, pageSize);
    }
  };
};
