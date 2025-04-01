import { ApButton, ApModal } from '@/components';
import ApTable, { ApDeleteRowIcon, ApEditRowIcon } from '@/components/table';
import { CreateActivity } from '@/modules/activity/components/create';
import { useActivityState } from '@/modules/activity/context';
import { ActivityTypes, IActivity } from '@/modules/activity/model';
import React, { useState } from 'react';
import { useReportState } from '../../context';
import { FaPlus } from 'react-icons/fa6';
import { ApDateTime } from '@/components/date';

interface IProps {
  title?: string;
  activities: IActivity[];
  applicationId: string;
  reportId: string;
}

export default function ReportActivity({ applicationId, activities, title, reportId }: IProps) {
  const { removeActivity } = useActivityState();
  const { fetchReport, filter } = useReportState();
  const [modal, setModal] = useState<any>()

  const handleDelete = (id: string) => {
    removeActivity(id).then(() => {
      fetchReport(filter, true);
    });
  };

  const handleEdit = (type: string, data: any) => {
    setModal({ show: true, type: 'update', data, activityType: type } as any);
  };

  return (
    <div>
      <div className="bg-primary/10 text-primary px-5 py-3 font-bold text-base flex justify-between items-center">
        <p>{title || 'Milstone & Activities'}</p>
        <ApButton
          onClick={() =>
            setModal({ show: true, type: 'create', activityType: ActivityTypes.MILESTONE } as any)
          }
          title="Add"
          className="!h-[35px] px-5 rounded-lg"
        />
      </div>

      <div className="p-5">
        <div className="flex flex-col gap-14">
          {!activities || activities?.length === 0 ? (
            <div className="text-sm flex justify-center items-center p-10">
              <p>No Data</p>
            </div>
          ) : (
            activities?.map((item: any) => (
              <ActivityItem
                key={item?._id}
                item={item}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleAdd={(type: ActivityTypes, parentId: string) =>
                  setModal({
                    show: true,
                    type: 'create',
                    activityType: type,
                    data: null,
                    parentId
                  } as any)
                }
              />
            ))
          )}
        </div>
      </div>

      <ApModal
        width={700}
        title={modal?.type === 'create' ? `Add ${(modal as any)?.activityType}` : `Update ${(modal as any)?.activityType}`}
        onDimiss={() => setModal({ show: false })}
        show={modal?.show}
      >
        <CreateActivity
          applicationId={applicationId}
          reportId={reportId}
          activity={modal?.data}
          parentId={(modal as any)?.parentId}
          type={(modal as any)?.activityType}
          onDissmiss={() => setModal({ show: false })}
        />
      </ApModal>
    </div>
  );
}

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

        <div>
          {item?.percentage}%
        </div>

        <div className="flex gap-3 items-center">
          {item?.type !== ActivityTypes.ACTIVITY && (
            <button
              className='text-primary text-xs font-semibold flex gap-2 items-center'
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

      <div className='flex flex-col gap-3'>
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
