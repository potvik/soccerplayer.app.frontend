import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import * as blockchain from '../blockchain';

const defaults = {};

export class UserStoreEx {
  public stores: IStores;
  @observable public isAuthorized: boolean;
  public status: statusFetching;
  redirectUrl: string;

  private onewallet: any;
  @observable public isOneWallet = false;

  @observable public sessionType: 'mathwallet' | 'ledger' | 'wallet';
  @observable public address: string;

  @observable public balance: string = '0';
  @observable public balanceDai: string = '0';
  @observable public balanceGem: string = '0';
  @observable public vat = { ink: '0', art: '0' };

  @observable vatInit = false;

  constructor() {
    setInterval(async () => {
      // @ts-ignore
      this.isOneWallet = window.onewallet && window.onewallet.isOneWallet;
      // @ts-ignore
      this.onewallet = window.onewallet;

      // await this.getBalances();
      // await this.getOneBalance();
    }, 3000);

    setInterval(() => this.getBalances(), 1 * 10 * 1000);

    // @ts-ignore
    this.isOneWallet = window.onewallet && window.onewallet.isOneWallet;
    // @ts-ignore
    this.onewallet = window.onewallet;

    const session = localStorage.getItem('harmony_session');

    const sessionObj = JSON.parse(session);

    if (sessionObj && sessionObj.address) {
      this.address = sessionObj.address;
      this.sessionType = sessionObj.sessionType;
      this.isAuthorized = true;

      this.getBalances();
    }
  }

  @action public signIn() {
    return this.onewallet.getAccount().then(account => {
      this.sessionType = `mathwallet`;
      this.address = account.address;
      this.isAuthorized = true;

      this.syncLocalStorage();

      this.getBalances();

      return Promise.resolve();
    });
  }

  @action public getBalances = async () => {
    if (this.address) {
      try {
        let res = await blockchain.getBalance(this.address);
        this.balance = res && res.result;

        this.balanceDai = await blockchain.getBalanceDai(this.address);

        this.balanceGem = await blockchain.getBalanceGem(this.address);

        this.vat = await blockchain.getVault(this.address);

        this.vatInit = true;
      } catch (e) {
        console.error(e);
      }
    }
  };

  @action public getOneBalance = async () => {
    if (this.address) {
      let res = await blockchain.getBalance(this.address);
      this.balance = res && res.result;
    }
  };

  @action public signOut() {
    if (this.sessionType === 'mathwallet' && this.isOneWallet) {
      return this.onewallet
        .forgetIdentity()
        .then(() => {
          this.sessionType = null;
          this.address = null;
          this.isAuthorized = false;

          this.balanceGem = '0';
          this.balanceDai = '0';
          this.balance = '0';

          this.vat = { ink: '0', art: '0' };

          this.syncLocalStorage();

          return Promise.resolve();
        })
        .catch(err => {
          console.error(err.message);
        });
    }
  }

  private syncLocalStorage() {
    localStorage.setItem(
      'harmony_session',
      JSON.stringify({
        address: this.address,
        sessionType: this.sessionType,
      }),
    );
  }

  @action public signTransaction(txn: any) {
    if (this.sessionType === 'mathwallet' && this.isOneWallet) {
      return this.onewallet.signTransaction(txn);
    }
  }

  public saveRedirectUrl(url: string) {
    if (!this.isAuthorized && url) {
      this.redirectUrl = url;
    }
  }

  @action public reset() {
    Object.assign(this, defaults);
  }
}
