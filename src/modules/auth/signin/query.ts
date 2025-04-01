import { useMutation } from "@apollo/client";
import gql from "graphql-tag";
import { toastSvc } from "../../../services";

const EMAIL_SIGNIN = gql`
  mutation signIn($email: String!, $password: String!, $client: String!) {
    signIn(email: $email, password: $password, client: $client) {
      userId
      name
      accessToken
      refreshToken
      refreshTokenExpiresIn
    }
  }
`;

export const useEmailSignIn = (onCompleted: any) => {
  return useMutation(EMAIL_SIGNIN, {
    onCompleted: (res) => {
      if (res.signIn) {
        // storageSvc.setItem(ApStorageKeys.Auth, res.signin);
        onCompleted(res.signIn);
      }
    },
    onError: (error) => {
      toastSvc.graphQlError(error);
    },
  });
};
