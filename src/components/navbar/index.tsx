import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

import Logo from '../../assets/srdc_logo.png';
import { ApImage } from '../image';
import { IModal } from '../modal';

interface NavbarProps {
  selectedKey?: string;
  selectedKeys?: string[];
  backButton?: React.ReactNode;
  items: MenuProps['items'];
  right?: React.ReactNode;
}

const Navbar = ({ selectedKey, selectedKeys, backButton, items, right }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <NavbarLayout>
        <nav className="flex items-center justify-between gap-20 w-full px-5 py-2">
          {!backButton ? (
            <Link href="/">
              <ApImage src={Logo} alt="Logo" width={50} height={50} className="" />
            </Link>
          ) : (
            <span className="cursor-pointer">{backButton}</span>
          )}

          <Menu
            selectedKeys={(selectedKeys as any) || [selectedKey]}
            className="custom-menu !bg-white flex items-center justify-center text-primary !border-transparent !w-full"
            mode="horizontal"
            items={items}
          />

          {right}

          <button onClick={() => setOpen(true)} className="hidden cus-md2:block">
            <FaBars color="#fff" />
          </button>
        </nav>
      </NavbarLayout>
    </>
  );
};

export default Navbar;

export const NavbarLayout = ({ children }: { children?: React.ReactNode }) => {
  return <div className="bg-white w-[100%] flex items-center z-50 shadow-md fixed">{children}</div>;
};
