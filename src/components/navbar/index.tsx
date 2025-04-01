import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

import Logo from '../../assets/logo-secondary.svg';
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
        <nav className="flex items-center justify-between w-full px-5 py-2 bg-primary">
          {!backButton ? (
            <Link href="/">
              <ApImage src={Logo} alt="Logo" width={150} height={110} className="" />
            </Link>
          ) : (
            <span className="cursor-pointer">{backButton}</span>
          )}

          <div className="flex items-center w-full cus-md2:hidden">
            <Menu
              selectedKeys={(selectedKeys as any) || [selectedKey]}
              className="custom-menu  !bg-primary text-white !border-transparent !w-full scale-95"
              mode="horizontal"
              items={items}
            />

            {right}
          </div>

          <button onClick={() => setOpen(true)} className="hidden cus-md2:block">
            <FaBars color="#fff" />
          </button>
        </nav>
      </NavbarLayout>

      {/* <ApModal width="80%" show={modal.show} onDimiss={() => setModal({ show: false })}>
        {modal.type === 'pettycash' && (
          <PettyCashEntry onDismiss={() => setModal({ show: false })} />
        )}
      </ApModal> */}
      {/* <MobileNav
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        profileItems={profileItems}
      /> */}
    </>
  );
};


export default Navbar;



export const NavbarLayout = ({ children }: { children?: React.ReactNode }) => {
  return <div className="bg-primary w-[100%] flex items-center z-50 shadow-md fixed">
    {children}
  </div>
}