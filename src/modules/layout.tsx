import { ApImage, ApText, IModal } from '@/components';
import { Menu, MenuProps, Tooltip } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa6';
import { IoIosLogOut, IoMdSettings } from 'react-icons/io';
import { IoBusinessOutline } from 'react-icons/io5';
import { SiDatabricks } from 'react-icons/si';
import Logo from '../assets/srdc_logo.png';
import { NavbarLayout } from '../components/navbar';
import { useConfigState } from './config/context';
import { usePermissionState } from './permission/context';
import { getNavItems, INavConfigItem } from '@/components/navbar/config';
import { useNotificationState } from './notification/context';

const Navbar = dynamic(() => import('../components/navbar'), {
  ssr: false,
  loading: () => <NavbarLayout />
});
interface IProps {
  selectedKey?: string;
  selectedKeys?: string[];
  containerClassName?: string;
  className?: string;
  subNav?: React.ReactNode;
  children: React.ReactNode;
  backButton?: React.ReactNode;
}

const RightNav = ({
  selectedKey,
  selectedKeys
}: {
  selectedKey?: string;
  selectedKeys?: string[];
}) => {
  const session: any = useSession();
  const router = useRouter();
  const { haveViewAccess } = usePermissionState();
  const { fetchNotificationCount, notificationCounts } = useNotificationState();
  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const profileItems: INavConfigItem[] = [
    {
      label: (
        <Tooltip title={'Notification'}>
          <Link href={'/notifications'} target="_blank">
            <div className="relative">
              <FaBell className="text-primary" size={24} />
              <div className="absolute w-6 h-6 flex items-center justify-center rounded-full -top-4 -right-4 bg-primary">
                <ApText size="xs" color="white">
                  {notificationCounts ?? 0}
                </ApText>
              </div>
            </div>
          </Link>
        </Tooltip>
      ),
      key: 'notification-icon'
    },
    {
      label: (
        <Tooltip title={'Settings'}>
          <IoMdSettings size={24} />
        </Tooltip>
      ),
      key: 'settings-icon',
      children: [
        {
          label: <Link href={'/master'}>Master Data</Link>,
          key: 'master',
          module: 'master',
          action: 'view'
        },
        {
          label: <Link href={'/maintenance/permission'}>Permission</Link>,
          key: 'access',
          module: 'permission',
          action: 'view'
        }
      ]
    },
    {
      label: <FaUserCircle size={24} />,
      key: 'profile-icon',
      children: [
        {
          label: (
            <button
              className="flex items-center justify-between w-full gap-2"
              onClick={() =>
                signOut({ redirect: false }).then(() => {
                  router.push('/login');
                })
              }
            >
              Sign Out
              <IoIosLogOut className="text-xl" />
            </button>
          ),
          key: 'sign-out'
        }
      ]
    }
  ].map((item: any) => {
    const accessCheckedItem = haveViewAccess(item.module || '', item, item.action);

    // If item has children and access is granted to parent
    if (accessCheckedItem && accessCheckedItem.children) {
      // Apply access check to each child
      accessCheckedItem.children = accessCheckedItem.children
        .map((child: any) => haveViewAccess(child.module || '', child, child.action))
        .filter(Boolean); // Remove any null/undefined items (denied access)
    }

    return accessCheckedItem;
  });

  return (
    <>
      {session?.data && (
        <Menu
          selectedKeys={(selectedKeys as any) || [selectedKey]}
          className="!bg-white flex justify-center items-center !text-primary !border-transparent scale-95"
          mode="horizontal"
          items={profileItems}
        />
      )}
    </>
  );
};

const MainLayout: React.FC<IProps> = ({
  children,
  selectedKey,
  selectedKeys,
  className,
  containerClassName,
  backButton,
  subNav
}) => {
  const { config } = useConfigState();

  const { haveViewAccess } = usePermissionState();

  const items: MenuProps['items'] = getNavItems({ config, haveAccess: haveViewAccess });

  const SubNav = () => {
    return subNav || <></>;
  };

  return (
    <div className="">
      <Navbar
        items={items}
        right={<RightNav />}
        selectedKeys={selectedKeys}
        selectedKey={selectedKey}
        backButton={backButton}
      />
      <SubNav />

      <div
        className={`w-full flex flex-col items-center  ${
          !subNav && 'pt-14'
        } overflow-scroll h-[99vh] ${containerClassName} `}
      >
        <div className={`${className} w-full pt-2`}>{children}</div>
      </div>
    </div>
  );
};

export const PublicLayout: React.FC<{ children: any }> = ({ children }) => {
  return (
    <div className="flex items-center justify-center h-screen w-full">
      <div className="h-screen  w-[30%] bg-primary flex cus-md2:flex-col-reverse cus-md2:justify-center cus-md2:items-center ">
        <div className="bg-cover w-full bg-center py-10 h-full relative flex items-center justify-center">
          <ApImage src={Logo} alt="Logo" width={100} height={100} />
        </div>
      </div>
      <div className="flex flex-col p-6 h-full justify-center w-[70%] items-center ">
        {children}
      </div>
    </div>
  );
};

export const SetupLayout: React.FC<IProps> = ({
  children,
  selectedKey,
  selectedKeys,
  className,
  containerClassName,
  subNav
}) => {
  const session: any = useSession();
  const SubNav = () => {
    return subNav || <></>;
  };

  const router = useRouter();

  const items: MenuProps['items'] = [
    {
      label: (
        <Link href="/master" className="text-[15px] cus-md:text-sm !text-white">
          Master Data
        </Link>
      ),
      key: 'master-data',
      icon: <SiDatabricks color="#fff" size={20} />
    },
    {
      label: (
        <Link href="/companies" className="text-[15px] cus-md:text-sm !text-white">
          Companies
        </Link>
      ),
      key: 'companies',
      icon: <IoBusinessOutline color="#fff" size={20} />
    }
  ];

  const profileItems: MenuProps['items'] = [
    {
      label: (
        <div className="flex items-center p-2 jusify-center">
          <FaUserCircle color="#fff" size={30} />
          <p className="ml-3 text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block !text-white">
            {session?.data?.user?.name}
          </p>
        </div>
      ),
      key: 'profile-icon',
      children: [
        {
          label: (
            <button
              className="flex items-center justify-between w-full gap-2"
              onClick={() => signOut({ redirect: false }).then(() => router.push('/login'))}
            >
              Sign Out
              <IoIosLogOut className="text-xl" />
            </button>
          ),
          key: 'sign-out'
        }
      ]
    }
  ];

  return (
    <div>
      <Navbar
        items={items}
        selectedKeys={selectedKeys}
        selectedKey={selectedKey}
        right={
          <>
            {session?.data && (
              <Menu
                selectedKeys={(selectedKeys as any) || [selectedKey]}
                className="!bg-primary flex justify-center items-center !text-white !border-transparent scale-95"
                mode="horizontal"
                items={profileItems}
              />
            )}
          </>
        }
      />
      <SubNav />

      <div
        className={`w-full flex flex-col items-center  ${
          !subNav && 'pt-14'
        } overflow-scroll max-h-[99vh] ${containerClassName} `}
      >
        <div className={`${className} w-full`}>{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
