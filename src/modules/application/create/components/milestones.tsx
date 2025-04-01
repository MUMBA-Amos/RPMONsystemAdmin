import { ApButton, ApDateRangePicker, ApDeleteRowIcon, ApEditRowIcon, ApTextInput } from '@/components';
import { ApDateTime } from '@/components/date';
import { useActivityState } from '@/modules/activity/context';
import { ActivityTypes, IActivity } from '@/modules/activity/model';
import { Formik, FormikProps, Form } from 'formik';
import moment from 'moment';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

export default function GrantApplicationMilestones({
  applicationId,
  onNext,
  onBack
}: {
  applicationId: string;
  onNext?: () => void;
  onBack?: () => void;
}) {
  const { activitys, removeActivity } = useActivityState();
  const [showForm, setShowForm] = useState<{
    open: boolean;
    type?: string;
    data?: any;
    parentId?: string;
  }>({
    open: activitys?.length === 0,
    type: ActivityTypes.MILESTONE,
    data: null
  });

  const handleEdit = (type: string, data: any) => {
    setShowForm({ open: true, type, data });
  };

  const handleDelete = (id: string) => {
    removeActivity(id, applicationId);
  };

  return (
    <div>
      <div className="flex justify-end mb-5">
        <ApButton
          onClick={() => setShowForm({ open: !showForm.open, type: ActivityTypes.MILESTONE })}
          title={showForm.open ? 'Close' : 'Add Milestone'}
          className="!w-[200px] !py-3"
        />
      </div>

      {showForm.open ? (
        <AddForm
          applicationId={applicationId}
          onNext={() => setShowForm({ open: false })}
          type={showForm.type}
          data={showForm.data}
          parentId={showForm.parentId}
        />
      ) : (
        <div className="flex flex-col gap-14">
          {activitys?.length === 0 ? (
            <div className="text-sm flex justify-center items-center p-10">
              <p>No Data</p>
            </div>
          ) : (
            activitys?.map((item: any) => (
              <ActivityItem
                key={item?._id}
                item={item}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAdd={(type: ActivityTypes, parentId: string) =>
                  setShowForm({ open: true, type, data: null, parentId })
                }
              />
            ))
          )}
        </div>
      )}

      <div className="flex justify-between mt-10 border-t pt-5">
        <ApButton btnType="outline" title="Back" className="!w-[200px] !py-3" onClick={onBack} />
        <ApButton onClick={onNext} title="Next" className="!w-[200px] !py-3" />
      </div>
    </div>
  );
}

export const AddForm = ({ onNext, type, data, applicationId, parentId }: any) => {
  const { saveActivity, updating } = useActivityState();
  const [duration, setDuration] = useState<{ fromDate: number; toDate: number }>({
    fromDate: data?.fromDate || 0,
    toDate: data?.toDate || 0
  });

  const handleSubmit = async (val: any) => {
    const { fromDate, toDate } = duration;

    const payload: any = {
      ...val,
      applicationId,
      type, fromDate,
      toDate,
      parentId: parentId
    };

    !payload?.parentId && delete payload?.parentId;

    saveActivity(payload, data?._id).then(() => onNext());

  };


  const handleDateChange = (date: { fromDate: number | null; toDate: number | null }) => {
    const fromDate = date.fromDate ? moment(date.fromDate).valueOf() : moment().valueOf();
    const toDate = date.fromDate ? moment(date.toDate).valueOf() : moment().valueOf();

    setDuration({ fromDate, toDate });
  };

  return (
    <Formik
      initialValues={{ name: data?.name || '', description: data?.description || '' }}
      onSubmit={handleSubmit}
    >
      {(props: FormikProps<any>) => (
        <Form className="flex flex-col gap-5">
          <ApTextInput label={type} name="name" placeHolder={type} />
          <ApDateRangePicker
            fromLabel="Start Date"
            toLabel="End Date"
            date={duration}
            onChange={(date) => handleDateChange(date)}
            containerClassName={'w-full'}
          />

          <ApTextInput label="Details" name="description" type="textarea" placeHolder="Details" />
          <div className="flex justify-end mt-5">
            <ApButton title="Save" className="!w-[80px] !py-2" type="submit" loading={updating} />
          </div>
        </Form>
      )}
    </Formik>
  );
};

const ActivityItem = ({ item, handleEdit, handleDelete, handleAdd }: any) => {
  return (
    <div className="border p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <p>
          {item?.type}: <span className="text-primary font-semibold">{item?.name}</span>
        </p>

        <div className="flex gap-3 items-center">
          <p className="text-sm text-primary font-semibold">
            <ApDateTime date={item?.fromDate} /> - <ApDateTime date={item?.toDate} />
          </p>
        </div>

        <div className="flex gap-3 items-center">
          {item?.type !== ActivityTypes.ACTIVITY && (
            <button
              className="text-primary text-xs font-semibold flex gap-2 items-center"
              onClick={() => {
                handleAdd(item?.type === 'MILESTONE' ? 'OBJECTIVE' : 'ACTIVITY', item?._id);
              }}
            >
              <FaPlus size={15} className="text-primary" />
              {`Add ${item?.type === 'MILESTONE' ? 'Objective' : 'Activity'}`}
            </button>
          )}

          <ApEditRowIcon
            onClick={() => handleEdit?.(item?.type, item)}
            tooltipTitle={`Edit ${item?.type}`}
          />

          <ApDeleteRowIcon
            onConfirm={() => handleDelete?.(item?._id)}
            tooltipTitle={`Delete ${item?.type}`}
          />
        </div>
      </div>
      <p className="leading-loose text-sm mb-2">{item?.description}</p>

      <div className="flex flex-col gap-3">
        {item?.children?.map((child?: any) => (
          <ActivityItem
            key={child?._id}
            item={child}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
          />
        ))}
      </div>

    </div>
  );
};
