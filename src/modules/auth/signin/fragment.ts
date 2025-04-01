import gql from 'graphql-tag';

export const AuthFragment = gql`
  fragment Auth on Auth {
    userId
    name
    kind
    storeId
    companyId
    accessToken
    refreshToken
    activeStoreId
    accessTokenExpiresIn
    refreshTokenExpiresIn
  }
`;
