import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { useExpenseQuery } from './gql/query';
import type { IExpense, IExpenseFilter, IExpensePayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IExpenseState {
  loading: boolean;
  updating: boolean;
  expenses: IExpense[];
  totalRecords: number;
  filter: IExpenseFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IExpenseFilter>>;
  fetchExpenses: (page: IExpenseFilter) => Promise<IExpense[]>;
  saveExpense: (payload: IExpensePayload, _id?: string) => Promise<IExpense | null>;
  removeExpense: (_id: string) => Promise<boolean>;
  setExpenses: (expenses: IExpense[]) => void
}

const ExpenseContext = createContext<IExpenseState | undefined>(undefined);

export const useExpenseState = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenseState must be used within a global Provider');
  }
  return context;
};

export const ExpenseContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const expenseQuery = useExpenseQuery();
  const [expenses, setExpenses] = useState<IExpense[]>([]);
  const [filter, setFilter] = useState<IExpenseFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchExpenses = async (filter: IExpenseFilter): Promise<IExpense[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return expenseQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.expensePage;
        if (data) {
          setExpenses(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createExpense = async (payload: IExpensePayload): Promise<IExpense | null> => {
    setUpdating(true);
    return expenseQuery
      .create({
        variables: { expense: payload }
      })
      .then((res) => {
        const data: IExpense = res?.data?.createExpenses;
        if (data) {
          setExpenses([data, ...expenses]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateExpense = async (_id: string, payload: IExpensePayload): Promise<IExpense | null> => {
    setUpdating(true);
    return expenseQuery
      .update({
        variables: { _id, expense: payload }
      })
      .then((res) => {
        const data: IExpense = res?.data?.updateExpense;
        if (data) {
          setExpenses(expenses?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveExpense = async (payload: IExpensePayload, _id?: string): Promise<IExpense | null> => {
    if (_id) {
      return updateExpense(_id, payload);
    }
    return createExpense(payload);
  };

  const removeExpense = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return expenseQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IExpense = res?.data?.deleteExpenses;
        if (data) {
          setExpenses(expenses.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <ExpenseContext.Provider
      value={{
        modal,
        setModal,
        fetchExpenses,
        expenses,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        saveExpense,
        removeExpense,
        setExpenses
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
