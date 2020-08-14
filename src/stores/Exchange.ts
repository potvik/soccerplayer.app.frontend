import { StoreConstructor } from './core/StoreConstructor';
import { action, observable } from 'mobx';
import * as blockchain from '../blockchain-bridge';
import { statusFetching } from '../constants';

export enum EXCHANGE_MODE {
  ETH_TO_ONE = 'ETH_TO_ONE',
  ONE_TO_ETH = 'ONE_TO_ETH',
}

export enum EXCHANGE_STEPS {
  BASE = 'BASE',
  CONFIRMATION = 'CONFIRMATION',
  SENDING = 'SENDING',
  RESULT = 'RESULT',
}

export class Exchange extends StoreConstructor {
  @observable mode: EXCHANGE_MODE = EXCHANGE_MODE.ONE_TO_ETH;
  @observable error = '';
  @observable txHash = '';
  @observable actionStatus: statusFetching = 'init';
  @observable step: EXCHANGE_STEPS = EXCHANGE_STEPS.BASE;

  constructor(stores) {
    super(stores);
  }

  defaultTransaction = {
    from: '',
    to: '',
    amount: '',
  };

  @observable transaction = this.defaultTransaction;

  @action.bound
  setMode(mode: EXCHANGE_MODE) {
    this.mode = mode;
  }

  @action.bound
  setStep(step: EXCHANGE_STEPS) {
    this.step = step;
  }

  @action.bound
  sendETHtoAddress() {
    return Promise.resolve(true);
  }

  @action.bound
  async sendONEtoAddress() {
    this.actionStatus = 'fetching';

    const res = await blockchain.sendTx(
      this.transaction.amount,
      this.stores.user.address,
      this.transaction.to,
    );

    this.txHash = res.txhash;

    if (res.error) {
      this.error = res.message;
      this.actionStatus = 'error';
      return;
    }

    this.actionStatus = 'success';
  }

  clear() {
    this.transaction = this.defaultTransaction;
    this.error = '';
    this.txHash = '';
    this.actionStatus = 'init';
  }
}
