import { createContext, useContext, useState } from 'react';
import { useUploadFileQuery } from './gql/query';
import { IFileUpload, IFileUploadQuery } from './model';
import { toastSvc } from '@/services';

interface IUploadFile {
  loading: boolean;
  files?: IFileUpload;
  uploadFile: (refId: string, file: any) => Promise<IFileUpload>;
  deleteFile: (id: string) => Promise<void>;
}

const UploadFileContext = createContext<IUploadFile | undefined>(undefined);

export const useUploadFileState = () => {
  const context = useContext(UploadFileContext);
  if (context === undefined) {
    throw new Error('app dispatch must be used within the app global provider');
  }
  return context;
};

type TProps = {
  children: React.ReactNode;
};

export const UploadFileContextProvider: React.FC<TProps> = ({ children }) => {
  const [files, setFiles] = useState<IFileUpload>();
  const [loading, setLoading] = useState<boolean>(false);
  const uploadQ = useUploadFileQuery();

  const uploadFile = async (refId: string, file: any) => {
    setLoading(true);
    return await uploadQ
      .uploadFile({ variables: { refId: refId, file: {files: file} } })
      .then((res) => {
        const data = res?.data?.updateAsset;
        if (data) {
          setFiles(data);
          toastSvc.success('Image Updated Successfully');
          return data;
        }
      })
      .finally(() => setLoading(false));
  };

  const deleteFile = async (id: string) => {
    setLoading(true);
    return await uploadQ
      .deleteFile({ variables: { id } })
      .then((res) => {
        const data = res?.data?.deleteFile;
        if (data) {
          toastSvc.success('Image Deleted Successfully');
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <UploadFileContext.Provider
      value={{
        loading,
        files,
        uploadFile,
        deleteFile
      }}
    >
      {children}
    </UploadFileContext.Provider>
  );
};
