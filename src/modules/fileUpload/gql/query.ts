import { gql, useMutation } from '@apollo/client';
import { FileUploadFragment } from './fragment';
import { toastSvc } from '@/services';

const UPLOAD_FILE = gql`
  mutation uploadFile($refId: String!, $file: FileUploadInput!) {
    uploadFile(refId: $refId, file: $file) {
      ...FileUpload
    }
  }
  ${FileUploadFragment}
`;

const DELETE_FILE = gql`
  mutation deleteFile($id: String!) {
    deleteFile(_id: $id)
  }
`;

export const useUploadFileQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const uploadFile = useMutation(UPLOAD_FILE, { onError });
  const deleteFile = useMutation(DELETE_FILE, { onError });

  return {
    uploadFile: uploadFile[0],
    deleteFile: deleteFile[0],
    loading: uploadFile[1].loading
  };
};
