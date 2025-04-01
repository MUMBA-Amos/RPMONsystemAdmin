import { useEffect } from 'react';
import DashboardOverview from './components/dashboardOverview';
import GrantCards from './components/grant-cards';
import { RecentActivities } from './components/recentAcivities';
import { RecentApplications } from './components/recentApplication';
import { RecentGrants } from './components/recentGrants';
import { useDashboardState } from './context';
import { ApLoader } from '@/components';

export const Dashboard = () => {
  const { dashboardReport, fetchDashboardReport, loading } = useDashboardState();

  useEffect(() => {
    fetchDashboardReport();
  }, []);  

  return (
    <>
      {loading ? (
        <div className='p-20'>
          <ApLoader />
        </div>
      ) : (
        <div className="flex flex-col mx-4 md:mx-6">
          <DashboardOverview />
          <div className="border-[0.3px] border-primary rounded-lg p-5 flex flex-col gap-6">
            <GrantCards />
            <RecentActivities />
            <div className="grid grid-cols-1 md:grid-cols-2 py-4 gap-6 md:gap-10">
              <RecentApplications />
              <RecentGrants />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
