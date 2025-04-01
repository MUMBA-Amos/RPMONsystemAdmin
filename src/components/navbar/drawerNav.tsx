import { CloseOutlined } from '@ant-design/icons';
import { Drawer, Menu, MenuProps } from 'antd';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { FC, useState } from 'react';
import { AiFillDatabase, AiOutlineGold, AiOutlineUser } from 'react-icons/ai';
import { BsPercent } from 'react-icons/bs';
import { FcDataConfiguration } from 'react-icons/fc';
import { FiSettings } from 'react-icons/fi';
import { IoMdNotifications } from 'react-icons/io';
import { MdDomainVerification, MdOutlineLogout, MdPayment } from 'react-icons/md';
import { RiAdminFill, RiCustomerService2Fill, RiFlag2Line, RiStackLine } from 'react-icons/ri';
import { TbShoppingCartDiscount } from 'react-icons/tb';
// import { ApNavItem } from '.';

interface IProps {
  open: boolean;
  onDissmiss: () => void;
}

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key?: React.Key,
  onClick?: () => void,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    onClick
  } as MenuItem;
}

const DrawerNav: FC<IProps> = ({ onDissmiss, open }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);

  const toggleCollapsed = () => {
    5;
    setCollapsed(!collapsed);
  };

  // SETTING STATE FOR ICON COLOR
  const [iconColor, setIconColor] = useState(false);

  //Scheme dropdown toggle using ant design
  const items: MenuItem[] = [
    // ApNavItem({
    // 	name: 'Dashboard',
    // 	route: '/',
    // 	icon: <FiMonitor />,
    // 	router,
    // }),
    // ApNavItem({
    // 	name: 'Product',
    // 	route: '/product',
    // 	icon: <SiHackthebox />,
    // 	router,
    // }),
    // ApNavItem({
    // 	name: 'Order',
    // 	route: '/order',
    // 	icon: <RiShoppingBag3Line color="#fff" size={20} />,
    // 	router,
    // }),
    // ApNavItem({
    // 	name: 'Store',
    // 	route: '/store',
    // 	icon: <FaStoreAlt color="#fff" size={20} />,
    // 	router,
    // }),

    // getItem(
    //   "Staff",
    //   "/staff",
    //   () => {
    //     router.push("/staff");
    //   },
    //   <TbUsers color="#fff" size={20} />
    // ),
    getItem(
      'Gold Rate',
      '/rate',
      () => {
        router.push('/rate');
      },
      <BsPercent color="#fff" size={20} />
    ),
    getItem(
      'Payments',
      '/payment',
      () => {
        router.push('/payment');
      },
      <MdPayment color="#fff" size={20} />
    ),
    // getItem(
    //   "Refund",
    //   "/refund",
    //   () => {
    //     router.push("/refund");
    //   },
    //   <RiRefundFill color="#fff" size={20} />
    // ),
    getItem(
      'Category',
      '/category',
      () => {
        router.push('/category');
      },
      <RiStackLine color="#fff" size={20} />
    ),
    getItem(
      'Notifications',
      '/notifications',
      () => {
        router.push('/notifications');
      },
      <IoMdNotifications color="#fff" size={20} />
    ),

    // getItem(
    //   "Store",
    //   "/store",
    //   () => {
    //     router.push("/store");
    //   },
    //   <MdLocalGroceryStore color="#fff" size={20} />
    // ),
    getItem(
      'Banner',
      '/banner',
      () => {
        router.push('/banner');
      },
      <RiFlag2Line color="#fff" size={20} />
    ),
    getItem(
      'KYC Verification',
      '/kyc',
      () => {
        router.push('/kyc');
      },

      <MdDomainVerification color="#fff" size={20} />
    ),
    getItem(
      'Customers',
      '/customers',
      () => {
        router.push('/customers');
      },
      <RiCustomerService2Fill color="#fff" size={20} />
    ),
    getItem(
      'Admin',
      '/admins',
      () => {
        router.push('/admins');
      },
      <RiAdminFill color="#fff" size={20} />
    ),

    getItem(
      'Subscribers',
      '/scheme/subscribers',
      () => {
        router.push('/scheme/subscribers');
      },
      <AiOutlineGold color="#fff" size={20} />
    ),
    getItem('Scheme', '/scheme', () => {}, <AiOutlineGold color="#fff" size={20} />, [
      getItem(
        'Redeem',
        '/scheme/redeem',
        () => {
          router.push('/scheme/redeem');
        },
        <AiOutlineGold color="#fff" size={20} />
      ),
      getItem(
        'Transactions',
        '/scheme/transactions',
        () => {
          router.push('/scheme/transactions');
        },
        <AiOutlineGold color="#fff" size={20} />
      )
    ]),

    getItem('Discount', '/discount', () => {}, <TbShoppingCartDiscount color="#fff" size={20} />, [
      getItem(
        'Discount Code',
        '/discount/code',
        () => {
          router.push('/discount/code');
        },
        <TbShoppingCartDiscount color="#fff" size={20} />
      ),
      getItem(
        'Product Discount',
        '/productDiscount',
        () => {
          router.push('/discount/discount');
        },
        <TbShoppingCartDiscount color="#fff" size={20} />
      )
    ])
    // getItem(
    //   "Permission",
    //   "/permission",
    //   () => {
    //     router.push("/permission");
    //   },
    //   <MdKey color="#fff" size={20} />
    // ),
  ];

  //Scheme dropdown toggle using ant design
  const items2: MenuItem[] = [
    getItem(
      'Settings',
      'settings',
      () => {},
      <FiSettings
        color="#fff"
        style={{ padding: 0 }}
        size={20}
        className="me-2"
        onClick={toggleCollapsed}
      />,
      [
        getItem(
          'Master Data',
          '/master',
          () => {
            router.push('/master');
          },
          <AiFillDatabase
            color="#fff"
            size={20}
            // className="hover:bg-cyan-500"
          />
        ),
        getItem(
          'Config',
          'Config',
          () => {
            router.push('/config');
          },
          <FcDataConfiguration color="#fff" size={20} className="text-white" />
        ),
        getItem(
          'Wingold ',
          'Wingold ',
          () => {
            router.push('/wingold');
          },
          <FcDataConfiguration color="#fff" size={20} className="text-white" />
        )
      ]
    ),
    getItem(
      'My Profile',
      '/profile',
      () => {
        router.push('/profile');
      },
      <AiOutlineUser color="#fff" size={20} />
    ),
    getItem('Logout', '.logout', () => signOut(), <MdOutlineLogout color="#fff" size={20} />)
  ];

  return (
    <Drawer
      open={open}
      onClose={onDissmiss}
      placement="right"
      zIndex={6000}
      footerStyle={{ padding: 0, borderWidth: 0 }}
      bodyStyle={{
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      contentWrapperStyle={{ width: '270px' }}
      closable={false}
    >
      <div className="flex justify-between border-b ">
        <button onClick={onDissmiss}>
          <CloseOutlined />
        </button>
      </div>

      <div className="flex h-full justify-between flex-col bg-primary">
        <div>
          <Menu
            className="text-base text-white w-full bg-primary"
            defaultSelectedKeys={[`${router.pathname}`]}
            onSelect={() => setIconColor(true)}
            mode="inline"
            onDeselect={() => setIconColor(false)}
            theme="light"
            items={items}
          />
        </div>

        <div className="px-1 w-full border-t bg-primary">
          <Menu
            className="text-3xl text-white bg-primary"
            defaultSelectedKeys={[`${router.pathname}`]}
            onSelect={() => setIconColor(true)}
            mode="inline"
            onDeselect={() => setIconColor(false)}
            theme="light"
            items={items2}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default DrawerNav;
