import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useBudgetQuery } from './gql/query';
import type { IBudget, IBudgetFilter, IBudgetPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IBudgetState {
  loading: boolean;
  updating: boolean;
  budgets: IBudget[];
  totalRecords: number;
  filter: IBudgetFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IBudgetFilter>>;
  fetchBudgets: (page: IBudgetFilter) => Promise<IBudget[]>;
  saveBudget: (payload: IBudgetPayload, _id?: string) => Promise<IBudget | null>;
  removeBudget: (_id: string) => Promise<boolean>;
  setBudgets: (budgets: IBudget[]) => void
}

const BudgetContext = createContext<IBudgetState | undefined>(undefined);

export const useBudgetState = () => {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudgetState must be used within a global Provider');
  }
  return context;
};

export const BudgetContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const budgetQuery = useBudgetQuery();
  const [budgets, setBudgets] = useState<IBudget[]>([]);
  const [filter, setFilter] = useState<IBudgetFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchBudgets = async (filter: IBudgetFilter): Promise<IBudget[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return budgetQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.budgetPage;
        if (data) {
          setBudgets(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createBudget = async (payload: IBudgetPayload): Promise<IBudget | null> => {
    setUpdating(true);
    return budgetQuery
      .create({
        variables: { budget: payload }
      })
      .then((res) => {
        const data: IBudget = res?.data?.createBudget;
        if (data) {
          setBudgets([data, ...budgets]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateBudget = async (_id: string, payload: IBudgetPayload): Promise<IBudget | null> => {
    setUpdating(true);
    return budgetQuery
      .update({
        variables: { _id, budget: payload }
      })
      .then((res) => {
        const data: IBudget = res?.data?.updateBudget;
        if (data) {
          setBudgets(budgets?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveBudget = async (payload: IBudgetPayload, _id?: string): Promise<IBudget | null> => {
    if (_id) {
      return updateBudget(_id, payload);
    }
    return createBudget(payload);
  };

  const removeBudget = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return budgetQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IBudget = res?.data?.deleteBudget;
        if (data) {
          setBudgets(budgets.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <BudgetContext.Provider
      value={{
        modal,
        setModal,
        fetchBudgets,
        budgets,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveBudget,
        removeBudget,
        setBudgets
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};
