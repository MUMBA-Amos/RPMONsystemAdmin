import { Menu } from 'antd';
import { MenuProps } from 'antd/lib/menu';
import { IoClose } from 'react-icons/io5';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  items: MenuProps['items'];
  profileItems: MenuProps['items'];
}

const MobileNav: React.FC<MobileNavProps> = ({ open, onClose, items, profileItems }) => {
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div
        className={`fixed right-0 top-0 h-full w-64 bg-primary overflow-y-auto transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="text-white">
            <IoClose size={24} />
          </button>
        </div>
        <Menu
          mode="inline"
          items={items}
          className="bg-primary text-white border-r-0"
          style={{ borderRight: 'none' }}
        />
        <Menu
          mode="inline"
          items={profileItems}
          className="bg-primary text-white border-r-0 mt-4"
          style={{ borderRight: 'none' }}
        />
      </div>
    </div>
  );
};

export default MobileNav;
