import MainLayout from '@/modules/layout';
import { OrganizationPage } from '@/modules/organization/page';
import React from 'react';

const Organization = () => {
  return (
    <MainLayout selectedKey="organization">
      <OrganizationPage />
    </MainLayout>
  );
};

export default Organization;
