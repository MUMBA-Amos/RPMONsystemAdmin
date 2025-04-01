import { config } from 'dotenv';
import helper from './helper';

config();

// get the server from local storage
export const serverAddress = (() => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_SERVER_URL_2 || process.env.NEXT_PUBLIC_SERVER_URL;
  }

  console.log('process.env.NEXT_PUBLIC_SERVER_URL', process.env.NEXT_PUBLIC_SERVER_URL);
  console.log('process.env.NEXT_PUBLIC_SERVER_URL_2', process.env.NEXT_PUBLIC_SERVER_URL_2);
  console.log('process.env.NEXT_PUBLIC_COMPANY_FINANCE_YEAR', process.env.NEXT_PUBLIC_COMPANY_FINANCE_YEAR);

  return localStorage.getItem("server") || process.env.NEXT_PUBLIC_SERVER_URL;
})();


interface IApEnvironment {
  Uri: {
    Api: string;
    Server: string;
    Graphql: string;

    Ws: string;
  };
  // RequireServerSetup: boolean;
  OneSignal: {
    AppId: string;
  };
  Google: {
    ApiKey: string;
  };
  Youtube: {
    ApiKey: string;
  };
}

export class Environment {
  static get Uri() {
    return {
      Api: `${serverAddress}/api/`,
      Server: serverAddress || '',
      Graphql: `${serverAddress}/graphql/`,
      Ws: `ws://${helper.getHostFromUrl(serverAddress || '')}/graphql`
    };
  }

  static get OneSignal() {
    return {
      AppId: 'xxxx'
    };
  }

  static get Youtube() {
    return {
      ApiKey: 'xxxx'
    };
  }

  static get Google() {
    return {
      ApiKey: 'xxxx'
    };
  }
}

const environment: IApEnvironment = {
  Uri: {
    Api: Environment.Uri.Api,
    Server: Environment.Uri.Server,
    Graphql: Environment.Uri.Graphql,
    Ws: Environment.Uri.Ws

  },
  // RequireServerSetup: process.env.NEXT_PUBLIC_REQUIRE_SERVER_SETUP === 'true',
  OneSignal: {
    AppId: 'xxxx'
  },
  Youtube: {
    ApiKey: 'xxxx'
  },
  Google: {
    ApiKey: 'xxxx'
  }
};

export default environment;
