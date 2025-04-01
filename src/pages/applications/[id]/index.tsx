import { ApGuardBuilder } from '@/guard';
import { useActivityState } from '@/modules/activity/context';
import { useApplicationState } from '@/modules/application/context';
import ApplicationDetailPage from '@/modules/application/detail';
import { findApplicationAsync } from '@/modules/application/gql/query';
import MainLayout from '@/modules/layout';
import { useReportState } from '@/modules/report/context';
import { findFinalReportAsync } from '@/modules/report/gql/query';
import { IReport } from '@/modules/report/model';
import { getSession } from 'next-auth/react';
import React, { useEffect } from 'react';

interface IProps {
  application: any;
}

const ApplicationDetail: React.FC<IProps> = ({ application }) => {
  const { application: cApplication, setApplication } = useApplicationState();
  const { formatActivities } = useActivityState();
  const { setFinalReport } = useReportState();

  useEffect(() => {
    const activities = formatActivities(application?.activities);

    setApplication({
      ...application,
      activities
    });
  }, [application]);

  return (
    <MainLayout selectedKey="customer">
      {cApplication && (
        <ApplicationDetailPage />
      )}
    </MainLayout>
  );
};

export default ApplicationDetail;

export async function getServerSideProps({ query, req }: { query: any; req: any }) {
  const session: any = await getSession({ req });
  const guard = new ApGuardBuilder(session, req);
  await guard.isAuth();

  if (guard.redirect.destination) {
    return {
      redirect: {
        destination: guard.redirect.destination,
        permenant: guard.redirect.permenant
      }
    };
  }

  const application = await findApplicationAsync(query?.id, session.token);

  return {
    props: { application: application || null }
  };
}
