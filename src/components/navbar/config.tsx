import { IConfig } from '@/modules/config/model';
import Link from 'next/link';
import { Dispatch } from 'react';

export interface INavConfigItem {
  label: string | JSX.Element;
  key: string;
  icon?: JSX.Element;
  module?: string;
  action?: string;
  children?: INavConfigItem[];
}

interface INavItemInput {
  config: IConfig;
  haveAccess: (module: string, object: any, action?: string) => any;
}

export const getNavItems = ({ config, haveAccess }: INavItemInput): INavConfigItem[] => {
  return [
    {
      label: (
        <Link href="/" className="text-[15px] cus-md:text-sm">
          Home
        </Link>
      ),
      key: 'dashboard'
    },
    {
      label: (
        <Link href="/grants" className="">
          Grants
        </Link>
      ),
      key: 'grants',
      module: 'grant',
      action: 'view',
      children: [
        {
          label: (
            <Link href="/grants/srdc-grants" className="">
              SRDC Grants
            </Link>
          ),
          key: 'grants',
          module: 'grant',
          action: 'view-srdc-grants'
        }
      ]
    },

    {
      label: (
        <Link href="/applications" className="">
          Applications
        </Link>
      ),
      key: 'application',
      module: 'application',
      action: 'view'
    },
    {
      label: (
        <Link href="/nominations" className="">
          Nominations
        </Link>
      ),
      key: 'nominations',
      module: 'nomination',
      action: 'view'
    },
    {
      label: (
        <Link href="/progress-report" className="">
          Progress Report
        </Link>
      ),
      key: 'progress-report',
      module: 'progress_report',
      action: 'view'
    },
    {
      label: (
        <Link
          href={'/audit-trails'}
          className="text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block"
        >
          Audit Trails
        </Link>
      ),
      key: 'audit',
      module: 'audit',
      action: 'view'
    },
    {
      label: (
        <Link href="/invitations" className="">
          Invitations
        </Link>
      ),
      key: 'invitations',
      module: 'invitation',
      action: 'view'
    },
    {
      label: (
        <Link href="/organization" className="">
          Organization
        </Link>
      ),
      key: 'organization',
      module: 'organization',
      action: 'view'
    },
    // {
    //   label: (
    //     <Link href="/batches" className="">
    //       Batch
    //     </Link>
    //   ),
    //   key: 'batch',
    //   module: 'batch',
    //   action: 'view'
    // },
    {
      label: (
        <Link href="/vote-heads" className="">
          Vote Heads
        </Link>
      ),
      key: 'vote-heads',
      module: 'vote_head',
      action: 'view'
    },
    {
      label: <Link href={'/users'}>Users</Link>,
      key: 'users',
      module: 'users',
      action: 'view'
    },
  ].map((item) => {
    const accessCheckedItem = haveAccess(item.module || '', item, item.action);

    // If item has children and access is granted to parent
    if (accessCheckedItem && accessCheckedItem.children) {
      // Apply access check to each child
      accessCheckedItem.children = accessCheckedItem.children.map((child: any) =>
        haveAccess(child.module || '', child, child.action)
      ).filter(Boolean); // Remove any null/undefined items (denied access)
    }

    return accessCheckedItem;
  });
};
