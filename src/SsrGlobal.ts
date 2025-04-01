import { NextRequest } from 'next/server';
import environment from './environment';
import helper from './helper';
import { ISession } from './models';

export class ApSsrGlobal {
  private static instance: ApSsrGlobal;
  public req: NextRequest | null = null;
  public session: ISession | null = null;
  public accessToken: string | null = null;
  public _serverAddress: string | null = null;

  private constructor() { }

  static getInstance(): ApSsrGlobal {
    if (!ApSsrGlobal.instance) {
      ApSsrGlobal.instance = new ApSsrGlobal();
    }
    return ApSsrGlobal.instance;
  }


  public set serverAddress(serverAddress: string) {
    this._serverAddress = serverAddress;
  }

  public get serverAddress(): string {


    if (this._serverAddress) {
      return this._serverAddress;
    }

    const server = helper.getCookie('server', this.req ? (this.req.headers as any).cookie : '');

    return server || environment.Uri.Server;
  }
}
