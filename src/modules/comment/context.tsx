import { createContext, useContext, useState } from 'react';
import { useCommentQuery } from './gql/query';
import { IComment, ICommentFilter, ICommentPayload } from './model';
import { mapPageFilter } from '@/helper';

interface ICommentState {
  loading: boolean;
  updating: boolean;
  comments: IComment[];
  totalRecords: number;
  fetchComments: (filter: ICommentFilter) => Promise<IComment[]>;
  saveComment: (payload: ICommentPayload, _id?: string) => Promise<IComment | null>;
  removeComment: (_id: string) => Promise<boolean>;
  setComments: React.Dispatch<React.SetStateAction<IComment[]>>;
}

const CommentContext = createContext<ICommentState | undefined>(undefined);

export const useCommentState = () => {
  const context = useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentState must be used within a CommentContextProvider');
  }
  return context;
};

export const CommentContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const commentQuery = useCommentQuery();
  const [comments, setComments] = useState<IComment[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  const fetchComments = async (filter: ICommentFilter): Promise<IComment[]> => {
    setLoading(true);
    const payload: any = mapPageFilter(filter);

    return commentQuery
      .page({
        variables: {
          page: {
            ...payload,
            keyword: filter?.keyword,
            refId: filter?.refId,
            propName: filter?.propName,
            parentId: filter?.parentId,
            userId: filter?.userId
          }
        }
      })
      .then((res) => {
        const data = res?.data?.commentPage;
        if (data) {
          setComments((prevComments) => {
            const newComments = data.data;
            const existingIds = new Set(prevComments.map((c: IComment) => c._id));
            const uniqueNewComments = newComments.filter((c: IComment) => !existingIds.has(c._id));
            return [...prevComments, ...uniqueNewComments];
          });
          setTotalRecords(data.totalRecords);
          return data?.data;
        }
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const createComment = async (payload: ICommentPayload): Promise<IComment | null> => {
    setUpdating(true);
    return commentQuery
      .create({
        variables: { comment: payload }
      })
      .then((res) => {
        const data: IComment = res?.data?.createComment;
        if (data) {
          setComments((prevComments) => [data, ...prevComments]);
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const updateComment = async (_id: string, payload: ICommentPayload): Promise<IComment | null> => {
    setUpdating(true);
    return commentQuery
      .update({
        variables: { _id, comment: payload }
      })
      .then((res) => {
        const data: IComment = res?.data?.updateComment;
        if (data) {
          setComments((prevComments) =>
            prevComments.map((c: IComment) => (c._id === _id ? data : c))
          );
          return data;
        }
        return null;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  const saveComment = async (payload: ICommentPayload, _id?: string): Promise<IComment | null> => {
    if (_id) {
      return updateComment(_id, payload);
    }
    return createComment(payload);
  };

  const removeComment = async (_id: string): Promise<boolean> => {
    setUpdating(true);
    return commentQuery
      .remove({ variables: { _id } })
      .then((res) => {
        const data: IComment = res?.data?.deleteComment;
        if (data) {
          // Remove the comment and all its replies
          setComments((prevComments) => {
            // First, remove the comment itself
            const withoutComment = prevComments.filter((c: IComment) => c._id !== _id);
            // Then, remove all replies to this comment
            return withoutComment.filter((c: IComment) => c.parentId !== _id);
          });
          return true;
        }
        return false;
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  return (
    <CommentContext.Provider
      value={{
        fetchComments,
        comments,
        totalRecords,
        loading,
        updating,
        saveComment,
        removeComment,
        setComments
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
