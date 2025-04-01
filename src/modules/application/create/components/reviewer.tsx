import { ApButton, ApSelectInput, ApTextInput } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { useReviewerState } from '@/modules/reviewer/context';
import { IReviewer } from '@/modules/reviewer/model';
import { useUserState } from '@/modules/user/context';
import { Form, Formik, FormikProps } from 'formik';
import { useEffect, useState } from 'react';
import { IApplication } from '../../model';
import { useApplicationState } from '../../context';

interface IProps {
  application: IApplication;
  reviewers: IReviewer[];
  refId?: string;
}

export default function ApplicationReviewer({ application, reviewers, refId }: IProps) {


  const { removeReviewer } = useReviewerState();
  const [showForm, setShowForm] = useState(reviewers?.length === 0);
  const [editingReviewer, setEditingReviewer] = useState<any>(null);

  const handleDelete = (id: string) => {
    removeReviewer(id);
  };

  const handleEdit = (member: any) => {
    setEditingReviewer(member);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <ApButton
          onClick={() => {
            setShowForm(!showForm);
            setEditingReviewer(null);
          }}
          title={showForm ? 'Close' : 'Add Reviewer'}
          className="!w-[200px] !py-3"
        />
      </div>

      {showForm ? (
        <AddForm
          applicationId={application?._id}
          refId={refId}
          onNext={() => {
            setShowForm(false);
            setEditingReviewer(null);
          }}
          editingReviewer={editingReviewer}
        />
      ) : (
        <Table handleDelete={handleDelete} handleEdit={handleEdit} reviewers={reviewers} />
      )}

    </div>
  );
}

const AddForm = ({
  onNext,
  editingReviewer,
  applicationId,
  refId
}: {
  onNext: any;
  applicationId: string;
  refId?: string;
  editingReviewer: IReviewer;
}) => {
  const { fetchUsers, loading, users } = useUserState();
  const { saveReviewer, updating } = useReviewerState();
  const { fetchApplication } = useApplicationState();
  useEffect(() => {
    fetchUsers({ page: 1, pageSize: 500 });
  }, []);

  const handleSubmit = async (val: any) => {
    const payload: any = {
      comment: val?.comment,
      reviewerId: val?.reviewer?.value,
      applicationId,
      refId
    };

    saveReviewer(payload, editingReviewer?._id).then(async () => {
      if (applicationId) {
        await fetchApplication(applicationId)
      }
      onNext()
    });
  };

  return (
    <div>
      <Formik
        initialValues={
          editingReviewer
            ? {
              status: editingReviewer?.status,
              comment: editingReviewer?.comment,
              reviewer: editingReviewer?.reviewer
                ? {
                  value: editingReviewer?.reviewer?._id,
                  label: `${editingReviewer?.reviewer?.firstName} ${editingReviewer?.reviewer?.lastName}`
                }
                : ''
            }
            : { status: '', comment: '', reviewer: '' }
        }
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(props: FormikProps<any>) => (
          <Form>
            <div className="flex flex-col gap-5">
              <ApSelectInput
                options={users?.map((item: any) => ({
                  value: item?._id,
                  label: `${item?.firstName} ${item?.lastName}`
                }))}
                isLoading={loading}
                label="Reviewer"
                name="reviewer"
                placeholder="Select Reviewer"
              />

              {/* <ApTextInput label="Status" name="status" placeHolder="Status" /> */}
              <ApTextInput label="Comment" name="comment" placeHolder="Comment" type="textarea" />
            </div>

            <div className="flex justify-end mt-10">
              <ApButton
                title={editingReviewer ? 'Update' : 'Save'}
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

const Table = ({ reviewers, handleDelete, handleEdit }: any) => {
  const columns: any = [
    // { title: 'No.', dataIndex: 'index', key: 'index' },
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      key: 'reviewer',
      render: (val: any) => `${val?.firstName} ${val?.lastName}`
    },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Team Reviewer" />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Team Reviewer"
          />
        </div>
      )
    }
  ];

  return (
    <ApTable
      columns={columns}
      dataSource={reviewers}
    />
  );
};
