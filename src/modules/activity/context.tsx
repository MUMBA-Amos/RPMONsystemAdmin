import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useActivityQuery } from './gql/query';
import type { IActivity, IActivityFilter, IActivityPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';
import { useApplicationQuery } from '../application/gql/query';

interface IActivityState {
  loading: boolean;
  updating: boolean;
  activitys: IActivity[];
  totalRecords: number;
  filter: IActivityFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IActivityFilter>>;
  fetchActivitys: (page: IActivityFilter) => Promise<IActivity[]>;
  saveActivity: (payload: IActivityPayload, _id?: string, isReport?: boolean) => Promise<IActivity | null>;
  removeActivity: (_id: string, applicationId?: string) => Promise<boolean>;
  setActivitys: (activitys: IActivity[]) => void;
  formatActivities: (activities: any[]) => IActivity[];
}

const ActivityContext = createContext<IActivityState | undefined>(undefined);

export const useActivityState = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error('useActivityState must be used within a global Provider');
  }
  return context;
};

export const ActivityContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const activityQuery = useActivityQuery();
  const applicationQuery = useApplicationQuery()
  const [activitys, setMActivitys] = useState<IActivity[]>([]);
  const [filter, setFilter] = useState<IActivityFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const formatActivities = (activities: any[]) => {
    const activityMap = new Map<string, any>();

    // First, store activities in a Map
    activities?.forEach((activity) => {
      activityMap.set(activity._id, { ...activity, children: [] });
    });

    let rootActivities: any[] = [];

    // Link children to their respective parents
    activityMap.forEach((activity) => {
      if (activity.parentId && activityMap.has(activity.parentId)) {
        activityMap.get(activity.parentId).children.push(activity);
      } else {
        rootActivities.push(activity);
      }
    });

    return rootActivities;
  };

  const setActivitys = (activities: any[]) => {
    setMActivitys(formatActivities(activities))
  };

  const fetchActivitys = async (filter: IActivityFilter): Promise<IActivity[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return activityQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.activityPage;
        if (data) {
          setActivitys(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createActivity = async (payload: IActivityPayload, isReport?: boolean): Promise<IActivity | null> => {
    setUpdating(true);
    return activityQuery
      .create({
        variables: { activity: payload }
      })
      .then((res) => {
        const data: IActivity = res?.data?.createActivity;
        if (!isReport) {
          applicationQuery.find({ variables: { application: { _id: data?.applicationId } } })
            .then((app) => {
              setActivitys(app?.data?.findOneApplication?.activities);
            })
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateActivity = async (
    _id: string,
    payload: IActivityPayload,
    isReport?: boolean
  ): Promise<IActivity | null> => {
    setUpdating(true);
    return activityQuery
      .update({
        variables: { _id, activity: payload }
      })
      .then((res) => {
        const data: IActivity = res?.data?.updateActivity;
        if (!isReport) {
          applicationQuery.find({ variables: { application: { _id: data?.applicationId } } })
            .then((app) => {
              setActivitys(app?.data?.findOneApplication?.activities);
            })
        }
        return data;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveActivity = async (
    payload: IActivityPayload,
    _id?: string,
    isReport?: boolean
  ): Promise<IActivity | null> => {
    if (_id) {
      return updateActivity(_id, payload, isReport);
    }
    return createActivity(payload, isReport);
  };

  const removeActivity = async (_id: string, applicationId?: string): Promise<boolean> => {
    setUpdating(true);
    return activityQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IActivity = res?.data?.deleteActivity;
        if (data && applicationId) {
          applicationQuery.find({ variables: { application: { _id: applicationId } } })
            .then((app) => {
              setActivitys(app?.data?.findOneApplication?.activities);
            })
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ActivityContext.Provider
      value={{
        modal,
        setModal,
        fetchActivitys,
        activitys,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveActivity,
        removeActivity,
        setActivitys,
        formatActivities
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
