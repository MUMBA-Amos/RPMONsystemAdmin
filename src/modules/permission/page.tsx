import { useEffect, useState } from 'react';
import { ApButton, ApContainer, ApDropDown, ApLoader, ApSwitchInput } from '../../components';
import ApTable from '../../components/table';
import { usePermissionState } from './context';
import { useAccessGroupState } from './group/context';
import { IAccessGroup } from './group/model';
import { CheckActionTypes, IPermissionModuleQueryInput } from './model';

interface IProps {}

const PermisssionTabs: React.FC<IProps> = () => {
  const { accessGroups, findAccessGroups } = useAccessGroupState();

  const {
    initLoading,
    findPermissionModules,
    permissions,
    addOrUpdatePermission,
    updateAllPermision
  } = usePermissionState();

  const [group, setGroup] = useState<IAccessGroup>();

  const [filter, setFilter] = useState<IPermissionModuleQueryInput>({
    groupId: ''
  });

  useEffect(() => {
    findAccessGroups({});
  }, []);

  useEffect(() => {
    if (!!accessGroups.length) {
      setGroup(accessGroups[0]);
      setFilter({ groupId: accessGroups[0]._id });
    }
  }, [accessGroups]);

  useEffect(() => {
    if (filter.groupId) findPermissionModules(filter);
  }, [filter]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: '',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return (
          <div className="flex justify-end items-center">
            {record?.action && (
              <ApSwitchInput
                ignoreFormik
                value={record?.hasPermission}
                containerStyle="!mb-0"
                onChange={() => {
                  addOrUpdatePermission({
                    actionId: record?._id,
                    moduleId: record?.moduleId,
                    groupId: filter?.groupId
                  });
                }}
              />
            )}
            {!record.action && (
              <div className="flex items-center gap-4 justify-end">
                <ApButton
                  className="h-[30px]"
                  btnType="outline"
                  title="Check All"
                  onClick={() => handleAddAll(record?._id)}
                />
                <ApButton
                  className="h-[30px]"
                  btnType="outline"
                  title="Uncheck All"
                  onClick={() => handleRemoveAll(record?._id)}
                />
              </div>
            )}
          </div>
        );
      }
    }
  ];

  const handleGroupChange = (val: any) => {
    setGroup(accessGroups.find((g) => g._id === val));
    setFilter({
      ...filter,
      groupId: val
    });
  };

  const handleAddAll = (moduleId?: string) => {
    updateAllPermision({ groupId: filter.groupId, action: CheckActionTypes.CHECK_ALL, moduleId });
  };

  const handleRemoveAll = (moduleId?: string) => {
    updateAllPermision({ groupId: filter.groupId, action: CheckActionTypes.UNCHECK_ALL, moduleId });
  };

  return (
    <>
      <ApContainer className="pt-2">
        <div className="flex items-center justify-between pb-3 mb-5 border-b">
          <div className="flex justify-between items-center w-full h-full gap-3 cus-sm2:grid cus-sm2:grid-cols-2">
            <ApDropDown
              label={group?.group ? group?.group : 'Group'}
              selected={group?.group}
              containerClassName="w-72 cus-sm2:w-full cus-xs:col-span-2"
              name="role"
              items={accessGroups.map((a) => ({
                value: a?._id,
                label: a?.group
              }))}
              onChange={handleGroupChange}
            />
            <div className="flex items-center justify-end gap-4 mr-7">
              <ApButton
                className="h-[30px]"
                btnType="outline"
                title="Check All"
                onClick={() => handleAddAll()}
              />
              <ApButton
                className="h-[30px] w-auto"
                btnType="outline"
                title="Uncheck All"
                onClick={() => handleRemoveAll()}
              />
            </div>
          </div>
        </div>

        <ApTable
          expandable={{ defaultExpandAllRows: true }}
          columns={columns as any}
          rowKey={(record) => record._id}
          scroll={{ y: 500 }}
          dataSource={permissions.map((w) => ({
            ...w,
            name: w?.name ? w.name.charAt(0).toUpperCase() + w.name.slice(1) : ''
          }))}
          loading={initLoading}
          pagination={false}
        />
      </ApContainer>
    </>
  );
};

export default PermisssionTabs;
