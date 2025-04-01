import { ApolloClient, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/link-error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import { GraphQLClient } from 'graphql-request';
import { createClient } from 'graphql-ws';
import { getSession } from 'next-auth/react';
import { ApSsrGlobal } from './SsrGlobal';
import environment from './environment';

const authLink = setContext(async (_, { headers }) => {
  const session: any = await getSession();
  return {
    headers: {
      ...headers,
      authorization: `Bearer ${session?.user?.accessToken}`
    }
  };
});

const uploadLink = createUploadLink({
  uri: environment.Uri.Graphql,
  fetchOptions: {
    credentials: 'include'
  }
});

const wsLink =
  typeof window !== 'undefined'
    ? new GraphQLWsLink(
      createClient({
        url: environment.Uri.Ws,
        retryAttempts: 6
      })
    )
    : uploadLink;

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors as any) {
      switch (err.extensions.code) {
        // Apollo Server sets code to UNAUTHENTICATED
        // when an AuthenticationError is thrown in a resolver
        case 'UNAUTHENTICATED':
          // Modify the operation context with a new token
          const oldHeaders = operation.getContext().headers;
          operation.setContext({
            headers: {
              ...oldHeaders
              // authorization: getNewToken(),
            }
          });
          // Retry the request, returning the new observable
          return forward(operation);
      }
    }
  }

  // To retry on network errors, we recommend the RetryLink
  // instead of the onError link. This just logs the error.
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink as any,
  ApolloLink.from([errorLink, authLink.concat(uploadLink as any)] as any) as any
);

const client = new ApolloClient({
  ssrMode: typeof window === 'undefined',
  link: splitLink,
  cache: new InMemoryCache() as any //.restore({}),
});
export default client;

export const getGqlClient = () => {
  return new GraphQLClient(`${ApSsrGlobal.getInstance().serverAddress}/graphql/`, {
    credentials: 'include',
    cache: 'no-cache',
    errorPolicy: 'all',
  }).setHeader('Authorization', `Bearer ${ApSsrGlobal.getInstance()?.accessToken}`);
};
