import { useMutation, useLazyQuery } from '@apollo/client';
import gql from 'graphql-tag';
import { getGqlClient } from '../../../ApolloClient';
import { toastSvc } from '../../../services';
import { ConfigFragment } from './fragment';
import { IConfig } from '../model';

const CREATE_CONFIG = gql`
  mutation createConfig($config: CreateConfigInput!) {
    createConfig(config: $config) {
      ...Config
    }
  }
  ${ConfigFragment}
`;

const UPDATE_CONFIG = gql`
  mutation updateConfig($config: UpdateConfigInput!) {
    updateConfig(config: $config) {
      ...Config
    }
  }
  ${ConfigFragment}
`;

const CONFIG = gql`
  query fetchCurrentConfig {
    fetchCurrentConfig {
      ...Config
    }
  }
  ${ConfigFragment}
`;

export const useConfigQuery = () => {
  const onError = (err: any) => {
    toastSvc.graphQlError(err);
  };

  const update = useMutation(UPDATE_CONFIG, {
    onError
  });

  const create = useMutation(CREATE_CONFIG, {
    onError
  });

  const fetch = useLazyQuery(CONFIG, {
    fetchPolicy: 'no-cache',
    onError
  });

  return {
    create: create[0],
    update: update[0],
    fetch: fetch[0]
  };
};

export const findConfigAsync = async (token: string): Promise<IConfig> => {
  return await getGqlClient()
    .setHeader('Authorization', `Bearer ${token}`)
    .request(CONFIG)
    .then((res: any) => {
      return res.fetchCurrentConfig;
    });
};
