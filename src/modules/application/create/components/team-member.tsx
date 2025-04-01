import { ApButton, ApMasterSelectInput, ApSelectInput, ApTextInput } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { useTeamMemberState } from '@/modules/team-members/context';
import { ITeamMember } from '@/modules/team-members/model';
import { useUserState } from '@/modules/user/context';
import { Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

export default function GrantApplicationTeamMember({ onNext, onBack, applicationId }: any) {
  const { teamMembers, removeTeamMember } = useTeamMemberState();
  const [showForm, setShowForm] = useState(teamMembers?.length === 0);
  const [editingMember, setEditingMember] = useState<any>(null);

  const handleDelete = (id: string) => {
    removeTeamMember(id);
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <ApButton
          onClick={() => {
            setShowForm(!showForm);
            setEditingMember(null);
          }}
          title={showForm ? 'Close' : 'Add Team Member'}
          className="!w-[200px] !py-3"
        />
      </div>

      {showForm ? (
        <AddForm
          applicationId={applicationId}
          onNext={() => {
            setShowForm(false);
            setEditingMember(null);
          }}
          editingMember={editingMember}
        />
      ) : (
        <Table handleDelete={handleDelete} handleEdit={handleEdit} members={teamMembers} />
      )}

      <div className="flex justify-between mt-10 border-t pt-5">
        <ApButton
          btnType="outline"
          title="Back"
          className="!w-[200px] !py-3"
          type="button"
          onClick={onBack}
        />
        <ApButton onClick={onNext} title="Next" className="!w-[200px] !py-3" />
      </div>
    </div>
  );
}

const AddForm = ({
  onNext,
  editingMember,
  applicationId
}: {
  onNext: any;
  applicationId: string;
  editingMember: ITeamMember;
}) => {
  const { fetchUsers, loading, users } = useUserState();
  const { saveTeamMember, updating } = useTeamMemberState();

  useEffect(() => {
    fetchUsers({ page: 1, pageSize: 500 });
  }, []);

  const handleSubmit = async (val: any) => {
    const payload: any = {
      name: val?.name,
      userId: val?.user?.value,
      roleId: val?.role?.value,
      applicationId
    };

    val?.type?.value == 'internal' ? delete payload?.name : delete payload?.userId;

    console.log(payload);

    if (editingMember) {
      saveTeamMember(payload, editingMember._id).then(() => onNext());
    } else {
      saveTeamMember(payload).then(() => onNext());
    }
  };

  return (
    <div>
      <Formik
        initialValues={
          editingMember
            ? {
                name: editingMember?.name,
                user: editingMember?.user
                  ? {
                      value: editingMember?.user?._id,
                      label: `${editingMember?.user?.firstName} ${editingMember?.user?.lastName}`
                    }
                  : '',
                role: { value: editingMember?.role?._id, label: editingMember?.role?.name },
                type: editingMember?.userId
                  ? { value: 'internal', label: 'Internal' }
                  : { value: 'external', label: 'External' }
              }
            : { type: '', role: '', user: '', name: '' }
        }
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="grid grid-cols-2 gap-5">
              <ApSelectInput
                options={[
                  { value: 'internal', label: 'Internal' },
                  { value: 'external', label: 'External' }
                ]}
                label="Member Type"
                name="type"
                placeholder="Member Type"
              />

              <ApMasterSelectInput
                label="Role"
                masterKey="team_member_role"
                name="role"
                placeholder="Role"
                containerClassName={'w-full'}
              />
            </div>

            <div className="mt-10">
              {props?.values?.type?.value === 'internal' && (
                <ApSelectInput
                  options={users?.map((item: any) => ({
                    value: item?._id,
                    label: `${item?.firstName} ${item?.lastName}`
                  }))}
                  isLoading={loading}
                  label="Team Member"
                  name="user"
                  placeholder="Team Member"
                />
              )}

              {props?.values?.type?.value === 'external' && (
                <ApTextInput
                  label="Name of Team Member"
                  name="name"
                  placeHolder="Name of Team Member"
                />
              )}
            </div>

            <div className="flex justify-end mt-10">
              <ApButton
                title={editingMember ? 'Update' : 'Save'}
                className="!w-[80px] !py-2"
                type="submit"
                loading={updating}
              />
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

const Table = ({ members, handleDelete, handleEdit }: any) => {
  const columns: any = [
    // { title: 'No.', dataIndex: 'index', key: 'index' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Team Member Role', dataIndex: 'role', key: 'role', render: (val: any) => val?.name },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Team Member" />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Team Member"
          />
        </div>
      )
    }
  ];

  return (
    <ApTable
      columns={columns}
      dataSource={members.map((item: any, i: number) => ({ ...item, index: i + 1 }))}
    />
  );
};
