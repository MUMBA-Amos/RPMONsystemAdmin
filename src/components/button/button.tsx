import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import { LuPrinter } from 'react-icons/lu';
import { ApAccessGuard } from '../guard';
import { ApIf } from '../container';
import { printUrl } from '@/utils';

interface IProps {
  title?: string | React.ReactNode;
  btnType?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  type?: 'submit' | 'button';
  className?: string;
  disabled?: boolean;
  color?: 'text-white' | string;
  onClick?: () => void;
  hidden?: boolean;
  children?: React.ReactNode;
  permission?: { module: string; action: string };
}

export const ApButton: React.FC<IProps> = ({
  title,
  type,
  className,
  loading,
  onClick,
  color,
  permission,
  disabled,
  hidden,
  btnType = 'primary',
  children
}) => {
  const btnClassName = () => {
    switch (btnType) {
      case 'outline':
        return `bg-white border border-primary text-primary `;
      case 'danger':
        return `bg-red-500 border text-white`;
      default:
        return `bg-primary  text-white`;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && type === 'submit') {
        const activeElement = document.activeElement;
        const button = document.querySelector('button[type="submit"]');

        if (activeElement !== button) {
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [type]);

  const renderButton = () => (
    <ApIf condition={!hidden}>
      <button
        type={type}
        className={`${loading && 'cursor-not-allowed'
          } flex items-center justify-center gap-3 text-sm rounded-sm w-full md:w-[200px] cus-sm2:text-xs py-3 px-5 cus-md3:px-2 font-light ${btnClassName()} ${color} ${disabled && 'cursor-not-allowed'
          } ${disabled && btnType !== 'outline' && '!bg-gray-400'} ${className}`}
        onClick={onClick}
        disabled={disabled || loading}
      >
        {loading ? <LoadingOutlined className="text-xl" /> : title || children}
      </button>
    </ApIf>
  );

  if (permission)
    return (
      <ApAccessGuard module={permission?.module} action={permission?.action}>
        {renderButton()}
      </ApAccessGuard>
    );

  return renderButton();
};

interface IPrintProps {
  url: string;
}

export const ApPrintButton: React.FC<IPrintProps> = ({ url }) => {

  const [downloading, setDownloading] = React.useState(false);


  const handlePrint = async () => {
    try {
      setDownloading(true);
      await printUrl(url);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ApButton className="!w-auto" onClick={handlePrint} loading={downloading}>
      <LuPrinter className="text-xl text-white" />
      Print
    </ApButton>
  );
};
