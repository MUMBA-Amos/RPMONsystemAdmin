import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useReviewerQuery } from './gql/query';
import type { IReviewer, IReviewerFilter, IReviewerPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';
import { isArray } from 'underscore';

interface IReviewerState {
  loading: boolean;
  updating: boolean;
  reviewers: IReviewer[];
  totalRecords: number;
  filter: IReviewerFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IReviewerFilter>>;
  fetchReviewers: (page: IReviewerFilter) => Promise<IReviewer[]>;
  saveReviewer: (payload: IReviewerPayload, _id?: string) => Promise<IReviewer | null>;
  removeReviewer: (_id: string) => Promise<boolean>;
  setReviewers: (reviewers: IReviewer[]) => void;
}

const ReviewerContext = createContext<IReviewerState | undefined>(undefined);

export const useReviewerState = () => {
  const context = useContext(ReviewerContext);
  if (!context) {
    throw new Error('useReviewerState must be used within a global Provider');
  }
  return context;
};

export const ReviewerContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const reviewerQuery = useReviewerQuery();
  const [reviewers, setReviewers] = useState<IReviewer[]>([]);
  const [filter, setFilter] = useState<IReviewerFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchReviewers = async (filter: IReviewerFilter): Promise<IReviewer[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return reviewerQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.reviewerPage;
        if (data) {
          setReviewers(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createReviewer = async (payload: IReviewerPayload): Promise<IReviewer | null> => {
    setUpdating(true);
    return reviewerQuery
      .create({
        variables: { reviewer: payload }
      })
      .then((res) => {
        const data: IReviewer = res?.data?.createReviewer;
        if (data) {
          setReviewers([data, ...reviewers]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateReviewer = async (
    _id: string,
    payload: IReviewerPayload
  ): Promise<IReviewer | null> => {
    setUpdating(true);
    return reviewerQuery
      .update({
        variables: { _id, reviewer: payload }
      })
      .then((res) => {
        const data: IReviewer = res?.data?.updateReviewer;
        if (data) {
          setReviewers(reviewers?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveReviewer = async (
    payload: IReviewerPayload,
    _id?: string
  ): Promise<IReviewer | null> => {
    if (_id) {
      return updateReviewer(_id, payload);
    }
    return createReviewer(payload);
  };

  const removeReviewer = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return reviewerQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IReviewer = res?.data?.deleteReviewer;
        if (data) {
          setReviewers(reviewers.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ReviewerContext.Provider
      value={{
        modal,
        setModal,
        fetchReviewers,
        reviewers,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveReviewer,
        removeReviewer,
        setReviewers
      }}
    >
      {children}
    </ReviewerContext.Provider>
  );
};
