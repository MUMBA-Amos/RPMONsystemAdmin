import { gql, useMutation } from "@apollo/client";
import { toastSvc } from "../../../../services";

const FORGOT_PASSWORD = gql`
  mutation forgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`;

const CHANGE_PASSWORD = gql`
  mutation changePassword($password: ChangePasswordInput!) {
    changePassword(password: $password)
  }
`;

export const usePasswordQuery = () => {
  const onError = (error: any) => {
    toastSvc.graphQlError(error);
  };

  const forgetPassword = useMutation(FORGOT_PASSWORD, { onError });

  const changePassword = useMutation(CHANGE_PASSWORD, { onError });

  return {
    forgetPassword,
    changePassword,
    loading: forgetPassword[1].loading || changePassword[1].loading,
  };
};
