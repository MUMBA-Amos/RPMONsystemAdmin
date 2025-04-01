import { ApBodyContainer, ApPageHeader, ApPageTitle } from '../../components';
import { ApTabs } from '../../components/container/tab';
import GroupsPage from './group/page';
import PermisssionTabs from './page';

type Props = {
  hasHeader?: boolean;
  addIssueEnabled?: boolean;
};

interface Node {
  _id: string;
  key?: string;
  name: string;
  parentId?: string;
  children?: Node[];
}

const PermissionPage = ({}: Props) => {
  return (
    <div>
      <ApPageHeader title="Permissions" />
      <ApBodyContainer className="permission-page">
        <ApTabs
          items={[
            {
              label: 'Permission',
              key: '1',
              children: <PermisssionTabs />
            },
            {
              label: 'Groups',
              key: '2',
              children: <GroupsPage />
            }
          ]}
        />
      </ApBodyContainer>
    </div>
  );
};

export default PermissionPage;
