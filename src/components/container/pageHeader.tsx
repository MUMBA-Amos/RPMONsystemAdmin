import Link from 'next/link';
import React, { useState } from 'react';
import { FaArrowLeft, FaBars } from 'react-icons/fa6';
import { ApPageTitle } from '../typography';
import { ApPopOption } from '../modal/options';

interface IProps {
  title: string | React.ReactNode;
  subTitle?: string;
  backHref?: any;
  className?: string | undefined;
  center?: React.ReactNode | undefined;
  left?: React.ReactNode | undefined;
  right?: React.ReactNode | undefined;
  onBack?: () => void;
}

export const ApPageHeader: React.FC<IProps> = ({
  onBack,
  title,
  backHref,
  center,
  left,
  subTitle,
  className,
  right
}) => {
  const [isPopOptionOpen, setIsPopOptionOpen] = useState(false);

  const togglePopOption = () => setIsPopOptionOpen(!isPopOptionOpen);

  return (
    <div
      className={`flex items-center justify-between w-full px-5 py-4 bg-[#F9F9F9] border-b-2 border-b-[#f0f0f0] ${className}`}
    >
      <div className="flex items-center gap-5">
        {onBack && <FaArrowLeft className="text-xl cursor-pointer text-primary" onClick={onBack} />}
        {backHref && (
          <Link href={backHref || ''}>
            <FaArrowLeft className="text-xl text-primary" />
          </Link>
        )}
        <div className="flex items-center   gap-3">
          <ApPageTitle className="w-full" title={title} />
          {subTitle && <span className="mt-1 text-sm font-light text-gray-400"> {subTitle}</span>}
        </div>
      </div>
      {center}
      <div className="hidden md:flex justify-between  items-center gap-3">
        <div className="flex-1">{left}</div>
        <div className="ml-auto">{right}</div>
      </div>
      {right && (
        <button className="md:hidden text-2xl" onClick={togglePopOption}>
          <FaBars />
        </button>
      )}
      <ApPopOption open={isPopOptionOpen} onClose={togglePopOption}>
        <div className="flex flex-col items-center justify-center gap-4">
          {left}
          {right}
        </div>
      </ApPopOption>
    </div>
  );
};
