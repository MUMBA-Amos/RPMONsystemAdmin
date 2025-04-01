import type React from 'react';
import { createContext, useContext, useState } from 'react';
import { usePublicationQuery } from './gql/query';
import type { IPublication, IPublicationFilter, IPublicationPayload } from './model';
import { DEFAULT_PAGE_SIZE } from '@/constants';
import { IModal } from '@/components';
import { mapPageFilter } from '@/helper';

interface IPublicationState {
  loading: boolean;
  updating: boolean;
  publications: IPublication[];
  totalRecords: number;
  filter: IPublicationFilter;
  modal: IModal<'create' | 'update' | 'create-batch'>;
  setModal: React.Dispatch<React.SetStateAction<IModal<'create' | 'update' | 'create-batch'>>>;
  setFilter: React.Dispatch<React.SetStateAction<IPublicationFilter>>;
  fetchPublications: (page: IPublicationFilter) => Promise<IPublication[]>;
  savePublication: (payload: IPublicationPayload, _id?: string) => Promise<IPublication | null>;
  removePublication: (_id: string) => Promise<boolean>;
  setPublications: (publications: IPublication[]) => void
}

const PublicationContext = createContext<IPublicationState | undefined>(undefined);

export const usePublicationState = () => {
  const context = useContext(PublicationContext);
  if (!context) {
    throw new Error('usePublicationState must be used within a global Provider');
  }
  return context;
};

export const PublicationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const publicationQuery = usePublicationQuery();
  const [publications, setPublications] = useState<IPublication[]>([]);
  const [filter, setFilter] = useState<IPublicationFilter>({ page: 1, pageSize: DEFAULT_PAGE_SIZE });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [modal, setModal] = useState<IModal<'create' | 'update' | 'create-batch'>>({
    show: false,
    type: 'create'
  });

  const fetchPublications = async (filter: IPublicationFilter): Promise<IPublication[]> => {
    setLoading(true);
    let payload: any = mapPageFilter(filter);

    return publicationQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword
          }
        }
      })
      .then((res) => {
        const data = res?.data?.publicationPage;
        if (data) {
          setPublications(data.data);
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createPublication = async (payload: IPublicationPayload): Promise<IPublication | null> => {
    setUpdating(true);
    return publicationQuery
      .create({
        variables: { publication: payload }
      })
      .then((res) => {
        const data: IPublication = res?.data?.createPublication;
        if (data) {
          setPublications([data, ...publications]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updatePublication = async (_id: string, payload: IPublicationPayload): Promise<IPublication | null> => {
    setUpdating(true);
    return publicationQuery
      .update({
        variables: { _id, publication: payload }
      })
      .then((res) => {
        const data: IPublication = res?.data?.updatePublication;
        if (data) {
          setPublications(publications?.map((g) => (g._id === _id ? data : g)));
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const savePublication = async (payload: IPublicationPayload, _id?: string): Promise<IPublication | null> => {
    if (_id) {
      return updatePublication(_id, payload);
    }
    return createPublication(payload);
  };

  const removePublication = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return publicationQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IPublication = res?.data?.deletePublication;
        if (data) {
          setPublications(publications.filter((g) => g._id !== _id));
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <PublicationContext.Provider
      value={{
        modal,
        setModal,
        fetchPublications,
        publications,
        setFilter,
        totalRecords,
        filter,
        loading,
        updating,
        savePublication,
        removePublication,
        setPublications
      }}
    >
      {children}
    </PublicationContext.Provider>
  );
};
