import React from 'react';
import { MdDownload } from 'react-icons/md';
import { useDashboardState } from '../context';
import ApplicationTrends from './application-trends';
import UserEngagement from './user-engagement';

export const RecentActivities = () => {
  const { dashboardReport } = useDashboardState();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between rounded-lg bg-primary text-white p-4 font-poppins">
        <div className="text-xl font-medium">Report & Analytics</div>

        {/* <div className="flex items-center gap-1">
          <MdDownload />
          <span className="underline text-sm">Download</span>
        </div> */}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-6 h-[400px]">
          <p className="text-lg font-medium">Application Trends</p>
          <ApplicationTrends />
        </div>

        <div className="flex flex-col gap-6 h-[400px]">
          <p className="text-lg font-medium">User Engagement Metrics</p>
          <UserEngagement />
        </div>

        <div className="border-[0.3px] border-primary rounded-lg w-full flex flex-col gap-4 overflow-hidden">
          <div className="w-full bg-primary text-white text-xl font-medium px-3 py-3">
            Recent Activities
          </div>

          <ul className="w-full flex flex-col gap-4 pl-10 list-disc overflow-y-auto pb-5">
            {dashboardReport?.activities?.map((item) => (
              <li className="text-base font-light" key={item?._id}>
                {item?.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
