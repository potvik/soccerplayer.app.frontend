import * as _ from 'lodash';
import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { HttpResponseError, createError } from 'utils';
import { statusFetching } from '../constants';

const defaults = {};

export class UserStoreEx {
  public stores: IStores;
  public isAuthorized: boolean;
  public status: statusFetching;

  @observable public isLogouting = false;

  @observable public hasActiveRequests = false;

  @observable public redirectUrl: string = '';

  @action.bound
  public showErrorEx(error: HttpResponseError) {
    this.status = 'error';

    const errorCode = _.get(error, 'response.body.error');

    if (errorCode) {
      return Promise.reject(createError('AUTH_ERROR', errorCode));
    }

    return Promise.reject(error);
  }

  @action public loginEx(user: string, password: string): Promise<void> {
    // return this.login(user, password)
    //   .then(() => {
    //     this.stores.routing.push('/temp');
    //   })
    //   .catch(this.showErrorEx);
    return Promise.resolve()
  }

  @action public logoutEx(): Promise<void> {
    this.isLogouting = true;
    this.redirectUrl = '';

    return Promise.resolve()
    // return api
    //   .post(ENDPOINTS.logout())
    //   .finally(this.logout)
    //   .then(() => {
    //     this.isLogouting = false;
    //
    //     Object.values(stores).forEach(store => store.clear && store.clear());
    //     clearAll();
    //     clearProcessTracker();
    //
    //     return Promise.resolve();
    //   })
    //   .catch(this.showErrorEx);
  }

  @action public setUser(data: Partial<UserStoreEx>) {
    Object.assign(this, data); // mobx set
  }

  @action public reset() {
    Object.assign(this, defaults);
  }

  public saveRedirectUrl(url: string) {
    if (!this.isAuthorized && url) {
      this.redirectUrl = url;
    }
  }

  private redirect() {
    const url =
      this.stores.routing.location.pathname +
      this.stores.routing.location.search;
    if (this.redirectUrl && url !== this.redirectUrl) {
      this.stores.routing.push(this.redirectUrl);
    }
  }

  @action.bound
  public onAuthSuccess = async (userInfo: any) => {

  };
}
