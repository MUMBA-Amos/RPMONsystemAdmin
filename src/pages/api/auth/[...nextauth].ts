import { ApSsrGlobal } from '@/SsrGlobal';
import { getHostUrl } from '@/utils';
import { ClientError, gql, GraphQLClient } from 'graphql-request';
import NextAuth from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';



const getApolloClient = () => {
  let url = ApSsrGlobal.getInstance().serverAddress;

  console.log('getApolloClient:', url);

  return new GraphQLClient(`${url}/graphql`, {
    credentials: 'include'
  });
};

const SIGN_IN = gql`
  mutation signIn($email: String!, $password: String!, $client: String!, $company: String) {
    signIn(email: $email, password: $password, client: $client, company: $company) {
      userId
      name
      roles
      kind
      storeId
      companyId
      accessToken
      refreshToken
      activeStoreId
      accessTokenExpiresIn
      refreshTokenExpiresIn
    }
  }
`;

const REFRESH_TOKEN = gql`
  mutation refreshToken($userId: String!, $refreshToken: String!) {
    refreshToken(userId: $userId, refreshToken: $refreshToken) {
      userId
      name
      kind
      roles
      storeId
      companyId
      accessToken
      refreshToken
      activeStoreId
      accessTokenExpiresIn
      refreshTokenExpiresIn
    }
  }
`;

async function signIn(variables: any, req: any) {
  ApSsrGlobal.getInstance().req = req;
  return await getApolloClient()
    .request(SIGN_IN, variables)
    .then((res: any) => {
      return mapTokens(res.signIn);
    })
    .catch((err) => {
      console.log("signIn:", err);
      const errorResult = typeof err === 'string' ? { error: err } : err;
      const error: any = new ClientError({ ...errorResult }, { query: SIGN_IN as any, variables });
      throw error.response.response?.errors[0];
    });
}

async function refreshAccessToken(token: any) {
  const variables = {
    userId: token?.userId,
    refreshToken: token?.refreshToken
  };
  return await getApolloClient()
    .request(REFRESH_TOKEN, variables)
    .then((res: any) => {
      return mapTokens(res.refreshToken);
    })
    .catch((err) => {
      const errorResult = typeof err === 'string' ? { error: err } : err;
      const error: any = new ClientError(
        { ...errorResult },
        { query: REFRESH_TOKEN as any, variables }
      );
      throw error.response.response?.errors[0];
    });
}

async function jwtCallback(params: any) {
  let { token, user, trigger } = params;

  if (trigger === 'update') {
    token = mapTokens(params.session);
  } else if (user?.accessToken) {
    token = mapTokens(user);
  }

  if (user?.roles) {
    token.roles = user.roles.toString();
  }
  // Return previous token if the access token has not expired yet
  if (Date.now() < token.accessTokenExpiresIn) {
    return token;
  }

  return await refreshAccessToken(token);
}

async function sessionCallback(params: any) {
  const { session, token } = params;

  try {
    session.id = token?.userId;
    session.token = token.accessToken;
    session.user = { ...token, sub: token?.userId };
  } catch (error) { }
  return Promise.resolve(session);
}

function mapTokens(user: any) {

  return {
    id: user?.userId,
    userId: user?.userId,
    name: user?.name,
    kind: user?.kind,
    storeId: user?.storeId,
    companyId: user?.companyId,
    activeStoreId: user?.activeStoreId,
    accessToken: user?.accessToken,
    refreshToken: user?.refreshToken,
    accessTokenExpiresIn: user?.accessTokenExpiresIn,
    user: user?.user
  };
}


// const getAuthUrl = (host: string) => {
//   const [hostname, port] = host.split(':');

//   // Check for localhost or IP
//   const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';

//   const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);


//   if (isLocalhost || isIP) {
//     return port ? `http://${hostname}:${port}` : `http://${hostname}:3000`;
//   }

//   return `https://${hostname}`;
// };

export default function authHandler(req: any, res: any) {

  return NextAuth(req, res, {
    secret: process.env.TOKEN_SECRET,
    pages: {
      signIn: `/api/auth/sigin`,
      signOut: '/login'
    },
    callbacks: {

      async jwt(params: any) {
        return jwtCallback(params);
      },
      async session(params: any) {
        return sessionCallback(params);
      }
    },
    providers: [
      CredentialProvider({
        name: 'credentials',
        type: 'credentials',
        credentials: {
          email: { label: 'Email', type: 'text', placeholder: 'jsmith' },
          password: { label: 'Password', type: 'password' }
        },
        async authorize(credentials: any, req: any) {
          const variables = {
            email: credentials.email,
            password: credentials.password,
            company: credentials.company,
            client: 'admin'
          };
          return await signIn(variables, req);
        }
      })
    ]
  })
};
