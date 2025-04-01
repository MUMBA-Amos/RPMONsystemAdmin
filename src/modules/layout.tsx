import { ApImage, IModal } from '@/components';
import { ApAccessGuard } from '@/components/guard';
import { USER_ACCESS } from '@/constants';
import { BankOutlined } from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { BsBoxes } from 'react-icons/bs';
import { FaUserCircle } from 'react-icons/fa';
import { FiMonitor } from 'react-icons/fi';
import { GrVirtualMachine } from 'react-icons/gr';
import { IoIosAdd, IoIosLogOut, IoIosMore } from 'react-icons/io';
import { IoBusinessOutline } from 'react-icons/io5';
import { PiChartLineDownBold, PiChartLineUpBold } from 'react-icons/pi';
import { SiDatabricks } from 'react-icons/si';
import Logo from '../assets/logo-primary.svg';
import { NavbarLayout } from '../components/navbar';
import { useConfigState } from './config/context';
import { usePermissionState } from './permission/context';

const Navbar = dynamic(() => import('../components/navbar'), {
  ssr: false,
  loading: () => <NavbarLayout />,
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

const EmployeeNavRight = ({ selectedKey, selectedKeys }: {
  selectedKey?: string;
  selectedKeys?: string[];
}) => {
  const session: any = useSession();
  const router = useRouter();
  const { haveViewAccess } = usePermissionState();


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
        { label: <Link href="/profile">My Profile</Link>, key: 'profile' },
        haveViewAccess(
          USER_ACCESS.COMPANY.MODULE,
          { label: <Link href={'/company'}>Company</Link>, key: 'company' },
          USER_ACCESS.COMPANY.ACTIONS.VIEW_COMPANY
        ),
        haveViewAccess(
          USER_ACCESS.SETTING.MODULE,
          { label: <Link href="/config">App Settings</Link>, key: 'config' },
          USER_ACCESS.SETTING.ACTIONS.VIEW_SETTINGS
        ),
        {
          label: (
            <Link
              className="flex items-center justify-between w-full gap-2"
              href='/select-company?force=true'
            >
              Switch Company
            </Link>
          ),
          key: 'switch-company'
        },
        {
          label: (
            <button
              className="flex items-center justify-between w-full gap-2"
              onClick={() => signOut({ redirect: false }).then(() => {
                router.push('/login')
              })}
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


  return <>
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

const MainLayout: React.FC<IProps> = ({
  children,
  selectedKey,
  selectedKeys,
  className,
  containerClassName,
  backButton,
  subNav
}) => {
  const { fetchCurrentConfig } = useConfigState();

  useEffect(() => {
    fetchCurrentConfig();
  }, []);

  const { config } = useConfigState();

  const { haveViewAccess } = usePermissionState();

  const [modal, setModal] = useState<IModal<'pettycash'>>({ show: false });

  const items: MenuProps['items'] = [
    haveViewAccess('dashboard', {
      label: (
        <Link href="/dashboard" className="text-[15px] cus-md:text-sm !text-white">
          Dashboard
        </Link>
      ),
      key: 'dashboard',
      icon: <FiMonitor color="#fff" size={20} />
    }),
    haveViewAccess('customer', {
      label: (
        <Link href="/customers" className=" !text-white">
          A/R
        </Link>
      ),
      key: 'customers',
      icon: <BsBoxes color="#fff" size={16} />
    }),
    haveViewAccess('sales', {
      label: (
        <p className="text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block !text-white">
          Sales
        </p>
      ),
      key: 'sales',
      icon: <PiChartLineDownBold color="#fff" size={20} />,
      children: [
        haveViewAccess(
          'sales',
          {
            label: <Link href="/sales/order">Sales Quotations</Link>,
            key: 'sales-quotation',
            children: [
              haveViewAccess(
                'sales',
                {
                  label: <Link href="/sales/quotation">Quotations</Link>,
                  key: 'sales-quotations'
                },
                'view-quotations'
              ),
              haveViewAccess(
                'sales',
                {
                  label: <Link href="/sales/quotation/new">New Quotation</Link>,
                  key: 'new-sales-quotation'
                },
                'create-quotation'
              )
            ]
          },
          'view'
        ),
        {
          label: <Link href="/sales/order">Sales Order</Link>,
          key: 'sales-order',
          children: [
            haveViewAccess(
              'sales',
              {
                label: <Link href="/sales/order">Sales Orders</Link>,
                key: 'sales-orders'
              },
              'view-orders'
            ),
            haveViewAccess(
              'sales',
              {
                label: <Link href="/sales/order/new">New Order</Link>,
                key: 'new-sales-order'
              },
              'create-order'
            )
          ]
        },
        {
          label: <Link href="/sales/invoice">Sales Invoice</Link>,
          key: 'sales-invoice',
          children: [
            haveViewAccess(
              'sales',
              {
                label: <Link href="/sales/invoice">Sales Invoices</Link>,
                key: 'sales-invoices'
              },
              'view-invoices'
            ),
            haveViewAccess(
              'sales',
              {
                label: <Link href="/sales/invoice/new">New Invoice</Link>,
                key: 'new-sales-invoice'
              },
              'create-invoice'
            )
          ]
        }
      ]
    }),
    haveViewAccess('suppliers', {
      label: (
        <Link href="/suppliers" className=" !text-white">
          A/P
        </Link>
      ),
      key: 'suppliers',
      icon: <BsBoxes color="#fff" size={16} />
    }),
    haveViewAccess('purchase', {
      label: (
        <p className="text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block !text-white">
          Purchase
        </p>
      ),
      key: 'purchase',
      icon: <PiChartLineUpBold color="#fff" size={20} />,
      children: [
        {
          label: <Link href="/purchase/requisition">Purchase Requisition</Link>,
          key: 'purchase-requisition',
          children: [
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/requisition">Purchase Requisitions</Link>,
                key: 'purchase-requisitions'
              },
              'view-requisitions'
            ),
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/requisition/new">New Requisition</Link>,
                key: 'new-requisition'
              },
              'create-requisition'
            )
          ]
        },
        {
          label: <Link href="/purchase/order">Purchase Order</Link>,
          key: 'purchase-order',
          children: [
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/order">Purchase Orders</Link>,
                key: 'purchase-orders'
              },
              'view-orders'
            ),
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/order/new">New Order</Link>,
                key: 'new-order'
              },
              'create-order'
            )
          ]
        },
        {
          label: <Link href="/purchase/invoice">Purchase Invoice</Link>,
          key: 'purchase-invoice',
          children: [
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/invoice">Purchase Invoices</Link>,
                key: 'purchase-invoices'
              },
              'view-invoices'
            ),
            haveViewAccess(
              'purchase',
              {
                label: <Link href="/purchase/invoice/new">New Invoice</Link>,
                key: 'new-invoice'
              },
              'create-invoice'
            )
          ]
        }
      ]
    }),
    haveViewAccess(
      'workflow',
      {
        label: (
          <Link href="/workflow/my-tasks" className=" !text-white">
            Workflow
          </Link>
        ),
        key: 'workflow',
        icon: <BsBoxes color="#fff" size={16} />
      },
      'view-workflow'
    ),
    haveViewAccess('finance', {
      label: (
        <p className="text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block !text-white">
          Account Center
        </p>
      ),
      key: 'finance',
      icon: <BankOutlined size={20} className=" !text-white !text-base" />,
      children: [
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/accounts">Accounts</Link>,
            key: 'accounts'
          },
          'view-accounts'
        ),
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/categories">Chart of Accounts</Link>,
            key: 'chart-of-accounts'
          },
          'view-account-type'
        ),
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/categories">Account Types</Link>,
            key: 'categories'
          },
          'categories'
        ),
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/cashbook">Cash Book Entries</Link>,
            key: 'cashbooks'
          },
          'view-cashbook-entries'
        ),
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/journals">Journal Entries</Link>,
            key: 'Journals'
          },
          'view-journal-entries'
        ),
        haveViewAccess(
          'finance',
          {
            label: <Link href="/finance/transactions">Transactions</Link>,
            key: 'transactions'
          },
          'view-transactions'
        ),
        {
          label: <label className="">General Purchase</label>,
          key: 'general-purchase',
          children: [
            haveViewAccess(
              'finance',
              {
                label: <Link href={`/finance/purchase`}>Purchase Entries</Link>,
                key: 'purchase-entries'
              },
              'view-purchase-entries'
            ),
            haveViewAccess(
              'finance',
              {
                label: (
                  <Link href={`/finance/purchase/new`}>
                    New Purchase
                    <IoIosAdd className="text-2xl" />
                  </Link>
                ),
                key: 'new-purchase'
              },
              'new-purchase'
            )
          ]
        },
        {
          label: <label className="">General Sales</label>,
          key: 'general-sales',
          children: [
            haveViewAccess(
              'finance',
              {
                label: <Link href={`/finance/sales`}>Sales Entries</Link>,
                key: 'sales-entries'
              },
              'view-sales-entries'
            ),
            haveViewAccess(
              'finance',
              {
                label: (
                  <Link href={`/finance/sales/new`}>
                    New Sales
                    <IoIosAdd className="text-2xl" />
                  </Link>
                ),
                key: 'new-sales'
              },
              'new-sales'
            )
          ]
        },
        {
          label: <label>Contra</label>,
          key: 'contra',
          children: [
            haveViewAccess(
              'finance',
              {
                label: <Link href={`/finance/contra`}>Contra Entries</Link>,
                key: 'contra-entries'
              },
              'view-contra-entries'
            ),
            haveViewAccess(
              'finance',
              {
                label: (
                  <Link href={`/finance/contra/new`}>
                    New Contra
                    <IoIosAdd className="text-2xl" />
                  </Link>
                ),
                key: 'new-contra'
              },
              'new-contra'
            )
          ]
        },
        {
          label: <label>Payment</label>,
          key: 'payment',
          children: [
            haveViewAccess(
              'finance',
              {
                label: <Link href={`/finance/cashbook/payment`}>Payment Entries</Link>,
                key: 'payment-entries'
              },
              'view-payment-entries'
            ),
            haveViewAccess(
              'finance',
              {
                label: (
                  <Link href={`/finance/cashbook/payment/new`}>
                    New Payment
                    <IoIosAdd className="text-2xl" />
                  </Link>
                ),
                key: 'add-payment'
              },
              'new-payment'
            )
          ]
        },
        {
          label: <label>Receipt</label>,
          key: 'receipt',
          children: [
            haveViewAccess(
              'finance',
              {
                label: <Link href={`/finance/cashbook/receipt`}>Receipt Entries</Link>,
                key: 'receipt-entries'
              },
              'view-receipt-entries'
            ),
            haveViewAccess(
              'finance',
              {
                label: (
                  <Link href={`/finance/cashbook/receipt/new`}>
                    New Receipt
                    <IoIosAdd className="text-2xl" />
                  </Link>
                ),
                key: 'add-receipt'
              },
              'new-receipt'
            )
          ]
        }
      ]
    }),
    haveViewAccess('assets', {
      label: (
        <Link href="/assets" className="text-[15px] cus-md:text-sm !text-white">
          Assets
        </Link>
      ),
      icon: <GrVirtualMachine color="#fff" size={20} />,
      key: 'assets'
    }),
    haveViewAccess('report', {
      label: (
        <p className="text-[15px] cus-md:text-sm leading-none p-0 m-0 inline-block !text-white">
          Report
        </p>
      ),
      key: 'report',
      icon: <PiChartLineUpBold color="#fff" size={20} />,
      children: [
        {
          label: <p className="text-dark"> Company Financials</p>,
          key: 'company-financials',
          children: [
            haveViewAccess(
              'report',
              {
                label: <Link href={'/report/trial-balance'}>Trial Balance</Link>,
                key: 'trial-balance'
              },
              'view-trial-balance'
            ),
            haveViewAccess(
              'report',
              {
                label: <Link href={'/report/pnl'}>Profit & Loss Report</Link>,
                key: 'profit-overview'
              },
              'view-profit-loss'
            ),
            haveViewAccess(
              'report',
              {
                label: <Link href={'/report/balance-sheet'}>Balance Sheet Report</Link>,
                key: 'balance-sheet'
              },
              'view-balance-sheet'
            )
          ]
        },
        {
          //  <Link href={'/report/inventory'}></Link>
          label: <p className="text-dark">Inventory Report</p>,
          key: 'inventory-report',
          children: [
            {
              label: <Link href={'/report/inventory-count'}>Inventory Count</Link>,
              key: 'inventory-count'
            },
            {
              label: <Link href={'/maintenance/item-pricing'}>Inventory Pricing</Link>,
              key: 'inventory-pricing'
            },
            {
              label: <Link href={'/maintenance/item'}>Inventory List</Link>,
              key: 'inventory-list'
            },
            {
              label: (
                <Link href={'/report/inventory-valuation-summary'}>
                  Inventory Valuation Summary
                </Link>
              ),
              key: 'inventory-valuation-summary'
            },
            {
              label: (
                <Link href={'/report/inventory-valuation-detail'}>Inventory Valuation Detail</Link>
              ),
              key: 'inventory-valuation-detail'
            },
            {
              label: <Link href={'/report/stock-movement-summary'}>Stock Movement Summary</Link>,
              key: 'stock-movement-summary'
            },
            {
              label: <Link href="/report/stock-movement">Stock Movement Detail</Link>,
              key: 'stock-movement-detail'
            },
            {
              label: <Link href="/stock/adjustments">Stock Adjustment</Link>,
              key: 'stock-adjustment'
            },
            {
              label: <Link href="/stock/transfer">Stock Transfer</Link>,
              key: 'stock-transfer'
            },
          ]
        },
        {
          label: <Link href={'/report/trade-payable'}>A/P Report</Link>,
          key: 'account-payable-report',
          children: [
            {
              label: <Link href={'/report/trade-payable'}>A/P Summary Report</Link>,
              key: 'account-payable-summary-report'
            },
            {
              label: <Link href={'/report/trade-payable'}>A/P Detail Report</Link>,
              key: 'account-payable-detail'
            },
            {
              label: <Link href={'/purchase'}>Purchases Analysis</Link>,
              key: 'account-payable-puchase-analysis'
            },
            {
              label: <Link href={'/suppliers'}>Supplier List</Link>,
              key: 'account-payable-vendors-list'
            },
            {
              label: <Link href={'/purchase'}>Purchases By Supplier</Link>,
              key: 'account-payable-puchase-by-supplier'
            },
            {
              label: <Link href={'/purchase'}>Purchases By Item</Link>,
              key: 'account-payable-purchase-by-item'
            }
          ]
        },
        {
          label: <Link href={'/report/trade-receivable'}>A/R Report</Link>,
          key: 'account-receivables-report',
          children: [
            {
              label: <Link href={'/report/trade-receivable'}>A/R Summary Report</Link>,
              key: 'account-receivable-summary-report'
            },
            {
              label: <Link href={'/report/trade-receivable'}>A/R Detail Report</Link>,
              key: 'account-receivables-detail-report'
            },
            {
              label: <Link href={'/sales'}>Sales Analysis</Link>,
              key: 'account-receivables-sales-analysis'
            },
            {
              label: <Link href={'/customers'}>Customer List</Link>,
              key: 'account-receivable-customer-list'
            },
            {
              label: <Link href={'/sales'}>Sales By Customer</Link>,
              key: 'account-receivable-sales-by-customer'
            },
            {
              label: <Link href={'/sales'}>Sales By Item</Link>,
              key: 'account-sales-by-item'
            }
          ]
        }
      ]
    }),
    haveViewAccess('setup', {
      label: (
        <div className="flex items-center gap-2">
          <IoIosMore color="#fff" size={18} className="translate-y-0.5" />
          <p className="!text-white">Setup</p>
        </div>
      ),
      key: 'more',
      children: [
        haveViewAccess(
          'setup',
          {
            label: <p>Employee Maintenance</p>,
            key: 'users',
            children: [
              haveViewAccess(
                'setup',
                {
                  label: <Link href="/maintenance/employees">Employees</Link>,
                  key: 'employees'
                },
                'view-employees'
              ),
              haveViewAccess(
                'setup',
                {
                  label: <Link href="/maintenance/permission">User Access</Link>,
                  key: 'permission'
                },
                'view-user-access'
              ),
              haveViewAccess(
                'setup',
                {
                  label: <Link href="/maintenance/department">Department</Link>,
                  key: 'department'
                },
                'view-department'
              )
            ]
          },
          'view-employees'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/maintenance/item">Item Maintenance</Link>,
            key: 'items'
          },
          'view-items'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/maintenance/categories">Item Category Maintenance</Link>,
            key: 'item-categories'
          },
          'view-item-categories'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/maintenance/types">Item Type Maintenance</Link>,
            key: 'master-types'
          },
          'view-item-types'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/maintenance/rate">Rate Maintenance</Link>,
            key: 'Rate'
          },
          'view-rates'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/maintenance/store">Store Maintenance</Link>,
            key: 'store'
          },
          'view-stores'
        ),
        haveViewAccess(
          'setup',
          {
            label: <Link href="/taxation">Tax Maintenance</Link>,
            key: 'Taxation'
          },
          'view-taxations'
        ),
      ]
    })
  ];

  const SubNav = () => {
    return subNav || <></>;
  };

  return (
    <div>
      <Navbar items={items} right={<EmployeeNavRight />} selectedKeys={selectedKeys} selectedKey={selectedKey} backButton={backButton} />
      <SubNav />

      <div
        className={`w-full flex flex-col items-center  ${!subNav && 'pt-14'
          } overflow-scroll h-[99vh] ${containerClassName} `}
      >
        <div className={`${className} w-full`}>{children}</div>
      </div>

    </div>
  );
};

export const PublicLayout: React.FC<{ children: any }> = ({ children }) => {
  return <div className="h-screen flex cus-md2:flex-col-reverse cus-md2:justify-center cus-md2:items-center bg-white w-full">
    <div className="cus-md2-min:w-[30%] w-full bg-primary bg-cover bg-center py-10 h-full relative flex items-center justify-center">
      <ApImage src={Logo} alt="Logo" width={250} height={130} />
    </div>

    <div className="flex flex-col cus-md2-min:w-[70%] w-full p-6 h-full justify-center items-center">
      {children} </div>
  </div>;
}



export const SetupLayout: React.FC<IProps> = ({ children,
  selectedKey,
  selectedKeys,
  className,
  containerClassName,
  subNav }) => {
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
    },
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
      <Navbar items={items} selectedKeys={selectedKeys} selectedKey={selectedKey} right={
        <>
          {session?.data && (
            <Menu
              selectedKeys={(selectedKeys as any) || [selectedKey]}
              className="!bg-primary flex justify-center items-center !text-white !border-transparent scale-95"
              mode="horizontal"
              items={profileItems}
            />
          )}</>
      } />
      <SubNav />


      <div
        className={`w-full flex flex-col items-center  ${!subNav && 'pt-14'
          } overflow-scroll max-h-[99vh] ${containerClassName} `}
      >
        <div className={`${className} w-full`}>{children}</div>
      </div>
    </div>
  );
}



export default MainLayout;
