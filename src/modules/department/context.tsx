import { createContext, useContext, useState } from 'react';
import { IDepartment, IDepartmentFilter, IDepartmentQueryInput } from './model';
import { IModal } from '@/components';
import { useDepartmentQuery } from './gql/query';
import { toastSvc } from '@/services';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IUser } from '../user/model';

type TDepartmentState = {
  departments: IDepartment[];
  department?: IDepartment;
  user?: IUser;
  loading: boolean;
  totalRecords: number;
  modal: IModal<'create' | 'update'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update'>>>;
  setDepartment: React.Dispatch<React.SetStateAction<IDepartment | undefined>>;
  setUser: React.Dispatch<React.SetStateAction<IUser | undefined>>;
  fetchDepartmentPage: (page: IDepartmentFilter) => Promise<void>;
  createDepartment: (workflow: IDepartment) => Promise<IDepartment>;
  deleteDepartment: (id: string) => Promise<boolean>;
  updateDepartment: (id: string, workflow: Partial<IDepartment>) => Promise<IDepartment>;
  findOneDepartment: (workflow: IDepartmentQueryInput) => Promise<IDepartment>;
};

const DepartmentContext = createContext<TDepartmentState | undefined>(undefined);

export const useDepartmentState = () => {
  const context = useContext(DepartmentContext);

  if (context === undefined)
    throw new Error('app dispatch must be used within the app global provider');

  return context;
};

interface IProps {
  children: React.ReactNode;
}

export const DepartmentContextProvider: React.FC<IProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [department, setDepartment] = useState<IDepartment>();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [modal, setModal] = useState<IModal<'create' | 'update'>>({
    show: false
  });
  const [user, setUser] = useState<IUser>();

  const DepartmentQ = useDepartmentQuery();

  const fetchDepartmentPage = async (page: IDepartmentFilter): Promise<void> => {
    setLoading(true);
    let payload: any = {
      skip: page.page === 1 ? 0 : (page.page - 1) * page.pageSize,
      take: page.pageSize
    };
    return await DepartmentQ.page({ variables: { page: payload } })
      .then((res) => {
        const data = res?.data?.departmentPage;

        if (data) {
          setDepartments(data?.data);
          setTotalRecords(data?.totalRecords);
        }
        return data;
      })
      .finally(() => setLoading(false));
  };

  const createDepartment = async (department: IDepartment): Promise<IDepartment> => {
    setLoading(true);
    return await DepartmentQ.create({ variables: { department: department } })
      .then((res) => {
        const data = res?.data?.createDepartment;

        if (data) {
          toastSvc.success('Department created Successfully');
          setDepartments([data, ...departments]);

          fetchDepartmentPage({
            page: 1,
            pageSize: DEFAULT_PAGE_SIZE
          });

          return data;
        }
      })
      .finally(() => setLoading(false));
  };

  const updateDepartment = async (
    id: string,
    department: Partial<IDepartment>
  ): Promise<IDepartment> => {
    setLoading(true);
    return await DepartmentQ.update({ variables: { id: id, department: department } })
      .then((res) => {
        const data = res?.data?.updateDepartment;

        if (data) {
          toastSvc.success('Department Updated Successfully');
          setDepartments(departments?.map((x: IDepartment) => (x._id === id ? data : x)));
          setDepartment(data);

          fetchDepartmentPage({
            page: 1,
            pageSize: DEFAULT_PAGE_SIZE
          });

          return data;
        }
      })
      .finally(() => setLoading(false));
  };

  const deleteDepartment = async (id: string): Promise<boolean> => {
    setLoading(true);
    return await DepartmentQ.remove({ variables: { id: id } })
      .then((res) => {
        const data = res?.data?.deleteDepartment;

        if (!data) {
          toastSvc.error('Error occurred while deleting');
          return;
        }

        toastSvc.success('Department Deleted Successfully');
        setDepartments(departments?.filter((x: IDepartment) => x._id !== id));
        return data;
      })
      .finally(() => setLoading(false));
  };

  const findOneDepartment = async (department: IDepartmentQueryInput): Promise<IDepartment> => {
    setLoading(true);
    return await DepartmentQ.find({ variables: { department: department } })
      .then((res) => {
        const data = res?.data?.findOneDepartment;

        if (data) setDepartment(data);
        return data;
      })
      .finally(() => setLoading(false));
  };

  return (
    <DepartmentContext.Provider
      value={{
        departments,
        department,
        setDepartment,
        modal,
        setModal,
        createDepartment,
        updateDepartment,
        fetchDepartmentPage,
        findOneDepartment,
        deleteDepartment,
        loading,
        totalRecords,
        user,
        setUser
      }}
    >
      {children}
    </DepartmentContext.Provider>
  );
};
