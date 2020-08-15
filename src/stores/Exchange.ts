import { StoreConstructor } from './core/StoreConstructor';
import { action, computed, observable } from 'mobx';
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

export interface IStepConfig {
  id: EXCHANGE_STEPS;
  buttons: Array<{
    title: string;
    onClick: () => void;
    validate?: boolean;
    transparent?: boolean;
  }>;
  title?: string;
}

export class Exchange extends StoreConstructor {
  @observable mode: EXCHANGE_MODE = EXCHANGE_MODE.ONE_TO_ETH;
  @observable error = '';
  @observable txHash = '';
  @observable actionStatus: statusFetching = 'init';
  @observable stepNumber = 0;

  @computed
  get step() {
    return this.stepsConfig[this.stepNumber];
  }

  constructor(stores) {
    super(stores);
  }

  defaultTransaction = {
    oneAddress: '',
    ethAddress: '0xb3359449767895d4a3c96025303c36149f28a575',
    amount: '4500000',
  };

  stepsConfig: Array<IStepConfig> = [
    {
      id: EXCHANGE_STEPS.BASE,
      buttons: [
        {
          title: 'Continue',
          onClick: () => {
            this.stepNumber = this.stepNumber + 1;
            this.transaction.oneAddress = this.stores.user.address;
          },
          validate: true,
        },
      ],
    },
    {
      id: EXCHANGE_STEPS.CONFIRMATION,
      buttons: [
        {
          title: 'Back',
          onClick: () => (this.stepNumber = this.stepNumber - 1),
          transparent: true,
        },
        {
          title: 'Confirm',
          onClick: () => {
            this.stepNumber = this.stepNumber + 1;
            this.sendONEtoAddress();
          },
        },
      ],
    },
    {
      id: EXCHANGE_STEPS.SENDING,
      buttons: [],
    },
    {
      id: EXCHANGE_STEPS.RESULT,
      buttons: [
        {
          title: 'Close',
          transparent: true,
          onClick: () => {
            this.clear();
            this.stepNumber = 0;
          },
        },
      ],
    },
  ];

  @observable transaction = this.defaultTransaction;

  @action.bound
  setMode(mode: EXCHANGE_MODE) {
    this.clear()
    this.mode = mode;
  }

  @action.bound
  sendETHtoAddress() {
    return Promise.resolve(true);
  }

  @action.bound
  async sendONEtoAddress() {
    this.actionStatus = 'fetching';

    this.txHash =
      '0xfaab89bb4385c464e6869c0132bdbc1f32181e621e699ef0b91f7b41bfa21129';

    return;

    const res = await blockchain.sendTx(
      this.transaction.amount,
      this.stores.user.address,
      this.transaction.ethAddress,
    );

    this.txHash = res.txhash;

    if (res.error) {
      this.error = res.message;
      this.actionStatus = 'error';
    } else {
      this.actionStatus = 'success';
    }

    this.stepNumber = this.stepsConfig.length - 1;
  }

  clear() {
    this.transaction = this.defaultTransaction;
    this.error = '';
    this.txHash = '';
    this.actionStatus = 'init';
    this.stepNumber = 0
  }
}
