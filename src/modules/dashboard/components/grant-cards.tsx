import Link from 'next/link';
import React from 'react';
import { useDashboardState } from '../context';

const GrantCards = () => {
  const { dashboardReport } = useDashboardState();

  return (
    <div className="grid grid-cols-4 gap-3">
      <div className="w-full px-5 py-8 gap-4 h-full rounded-lg border-2 border-primary flex flex-col items-center justify-center font-poppins text-center bg-primary">
        <div className="flex items-center gap-4 justify-center">
          <h1 className="text-xl font-medium text-white w-[70%]">
            Available Grants
          </h1>

          <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
            <span className="text-primary text-xl">{dashboardReport?.availableGrantsCount}</span>
          </div>
        </div>

        <Link href="/grants" className="text-base text-center underline text-white">
          Click To View
        </Link>
      </div>

      <div className="w-full px-5 py-8 gap-4 h-full rounded-lg border-2 border-primary flex flex-col items-center justify-center font-poppins text-center bg-primary">
        <div className="flex items-center gap-4 justify-center">
          <h1 className="text-xl font-medium text-white w-[70%]">
            Nominations
          </h1>

          <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
            <span className="text-primary text-xl">{dashboardReport?.nominationsCount}</span>
          </div>
        </div>

        <Link href="/nominations" className="text-base text-center underline text-white">
          Click To View
        </Link>
      </div>

      <div className="w-full px-5 py-8 gap-4 h-full rounded-lg border-2 border-primary flex flex-col items-center justify-center font-poppins text-center bg-primary">
        <div className="flex items-center gap-4 justify-center">
          <h1 className="text-xl font-medium text-white w-[70%]">
            Total Application Submitted
          </h1>

          <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
            <span className="text-primary text-xl">{dashboardReport?.applicationsCount}</span>
          </div>
        </div>

        <Link href="/applications" className="text-base text-center underline text-white">
          Click To View
        </Link>
      </div>

      <div className="w-full px-5 py-8 gap-4 h-full rounded-lg border-2 border-primary flex flex-col items-center justify-center font-poppins text-center bg-primary">
        <div className="flex items-center gap-4 justify-center">
          <h1 className="text-xl font-medium text-white w-[70%]">
            Endorsements
          </h1>

          <div className="w-[50px] h-[50px] rounded-full bg-white flex items-center justify-center">
            <span className="text-primary text-xl">{dashboardReport?.endorsementCount}</span>
          </div>
        </div>

        <Link href="/applications" className="text-base text-center underline text-white">
          Click To View
        </Link>
      </div>
    </div>
  );
};

export default GrantCards;
