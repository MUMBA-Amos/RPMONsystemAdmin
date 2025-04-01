import environment from './environment';
import helper from './helper';
import { ISession } from './models';
import { checkAccessAsync } from './modules/permission/gql/query';
import { ApSsrGlobal } from './SsrGlobal';

class IRedirect {
  destination?: string;
  permenant?: boolean;
}

class Guard {
  redirect: IRedirect = { destination: '' };
  isAuth: boolean = false;
  haveAccess: boolean = false;
  globalSsr: ApSsrGlobal = ApSsrGlobal.getInstance();
  describe(): string {
    return `test`;
  }
}

export class ApGuardBuilder {
  private guard: Guard;
  private session: ISession;
  private req: any;
  private globalSsr: ApSsrGlobal = ApSsrGlobal.getInstance();
  constructor(session: ISession, req?: any) {
    this.guard = new Guard();
    this.session = session;
    this.req = req;
    this.globalSsr = ApSsrGlobal.getInstance();
    this.mappSsrGlobal();
  }

  private mappSsrGlobal() {
    this.globalSsr.req = this.req;
    this.globalSsr.session = this.session;
    this.globalSsr.accessToken = this.session?.user?.accessToken as string;
    this.globalSsr.serverAddress = helper.getCookie('server', this.req ? this.req.headers.cookie : '') || environment.Uri.Server;
    // this.globalSsr.serverAddress = environment.RequireServerSetup
    //   ? helper.getCookie('server', this.req ? this.req.headers.cookie : '') || ''
    //   : environment.Uri.Server;
  }

  setSsrGlobal(serverAddress: string, accessToken?: string) {
    this.globalSsr.serverAddress = serverAddress.trim();
    this.globalSsr.accessToken = accessToken as string;
    return this;
  }

  isAuth() {
    if (!this.session) {
      this.guard.redirect = {
        destination: '/login',
        permenant: false
      };
    }

    return this;
  }

  async haveAccess(module: string, action: string, redirect: string = '/') {
    if (!this.session?.user) {
      this.guard.redirect = {
        destination: redirect,
        permenant: false
      };
      return this;
    }

    const haveAccess = await checkAccessAsync(
      {
        userId: (this.session?.user as any)?.id,
        module: module,
        action: action
      },
      this.req,
      (this.session as any).token
    );
    if (!haveAccess) {
      this.guard.redirect = {
        destination: redirect,
        permenant: false
      };
    }

    return this;
  }

  build(): Guard {
    return this.guard;
  }

  get redirect(): IRedirect {
    return this.guard.redirect;
  }

  get hasRedirect(): boolean {
    return this.guard?.redirect?.destination !== '';
  }
}
