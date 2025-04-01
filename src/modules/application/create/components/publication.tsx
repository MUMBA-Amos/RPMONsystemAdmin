import { ApButton, ApMasterSelectInput, ApSelectInput, ApTextInput } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { usePublicationState } from '@/modules/publication/context';
import { IPublication } from '@/modules/publication/model';
import { Form, Formik, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

export default function GrantApplicationPublication({ onNext, onBack, applicationId }: any) {
  const { publications, removePublication } = usePublicationState();
  const [showForm, setShowForm] = useState(publications?.length === 0);
  const [editingPublication, setEditingPublication] = useState<any>(null);

  const handleDelete = (id: string) => {
    removePublication(id);
  };

  const handleEdit = (publication: any) => {
    setEditingPublication(publication);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <ApButton
          onClick={() => {
            setShowForm(!showForm);
            setEditingPublication(null);
          }}
          title={showForm ? 'Close' : 'Add Publication'}
          className="!w-[200px] !py-3"
        />
      </div>

      {showForm ? (
        <AddForm
          applicationId={applicationId}
          onNext={() => {
            setShowForm(false);
            setEditingPublication(null);
          }}
          editingPublication={editingPublication}
        />
      ) : (
        <Table handleDelete={handleDelete} handleEdit={handleEdit} publications={publications} />
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
  editingPublication,
  applicationId
}: {
  onNext: any;
  applicationId: string;
  editingPublication: IPublication;
}) => {
  const { savePublication, updating } = usePublicationState();

  const handleSubmit = async (val: any) => {
    let payload: any = {
      ...val,
      year: parseInt(val?.year),
      applicationId,
      paperTypeId: val?.paperType?.value,
      tierId: val?.publicationTier?.value
    };

    delete payload?.paperType;

    delete payload?.publicationTier;

    savePublication(payload, editingPublication?._id).then(() => onNext());

  };

  return (
    <div>
      <Formik
        initialValues={
          editingPublication
            ? {
              title: editingPublication?.title,
              status: editingPublication?.status,
              year: editingPublication?.year,
              doi: editingPublication?.doi,
              url: editingPublication?.url,
              submittedTo: editingPublication?.submittedTo,
              paperType: {
                value: editingPublication?.paperType?._id,
                label: editingPublication?.paperType?.name
              },
              publicationTier: {
                value: editingPublication?.paperType?._id,
                label: editingPublication?.paperType?.name
              }
            }
            : {
              title: '',
              paperType: '',
              publicationTier: '',
              status: '',
              year: '',
              doi: '',
              url: '',
              submittedTo: ''
            }
        }
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {(props: FormikProps<any>) => (
          <Form className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput label="Title" name="title" placeHolder="Title" />
              <ApMasterSelectInput
                label="Tier"
                masterKey="publication_tier"
                name="publicationTier"
                placeholder="Tier"
                containerClassName={'w-full'}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput label="Status" name="status" placeHolder="Status" />
              <ApMasterSelectInput
                label="Paper Type"
                masterKey="paper_type"
                name="paperType"
                placeholder="Paper Type"
                containerClassName={'w-full'}
              />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput
                label="Publication Year"
                name="year"
                placeHolder="Publication Year"
                type="number"
              />
              <ApTextInput label="DOI" name="doi" placeHolder="DOI" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <ApTextInput label="Article URL" name="url" placeHolder="Article URL..." />
              <ApTextInput label="Submitted To" name="submittedTo" placeHolder="Submitted To" />
            </div>
            <div className="flex justify-end mt-10">
              <ApButton
                title={editingPublication ? 'Update' : 'Save'}
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

const Table = ({ publications, handleDelete, handleEdit }: any) => {
  const columns: any = [
    { title: 'Title', dataIndex: 'title', key: 'title' },
    {
      title: 'Paper Type',
      dataIndex: 'paperType',
      key: 'paperType',
      render: (val: any) => val?.name
    },
    { title: 'Tier', dataIndex: ['tier', 'name'], key: 'tier' },
    { title: 'Status', dataIndex: 'status', key: 'status' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'DOI', dataIndex: 'doi', key: 'doi' },
    { title: 'URL', dataIndex: 'url', key: 'url' },
    { title: 'Submitted To', dataIndex: 'submittedTo', key: 'submittedTo' },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right',
      fixed: 'right',
      render: (_: any, record: any) => (
        <div className="flex space-x-2 justify-end items-center">
          <ApEditRowIcon onClick={() => handleEdit(record)} tooltipTitle="Edit Publication" />
          <ApDeleteRowIcon
            onConfirm={() => handleDelete(record._id)}
            tooltipTitle="Delete Publication"
          />
        </div>
      )
    }
  ];

  return <ApTable columns={columns} dataSource={publications} />;
};
