import { action, computed, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain';

export enum ACTIONS_TYPE {
  PAY_BACK_DAI = 'PAY_BACK_DAI',
  GENERATE_DAI = 'GENERATE_DAI',
  WITHDRAWAL_ONE = 'WITHDRAWAL_ONE',
}

export class OpenVault extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';
  @observable public actionStatus: statusFetching = 'init';
  @observable public txId: string;
  @observable public error: string;

  @computed get hasVault() {
    return !!Number(this.stores.user.vat.ink);
  }

  @observable public currentStep = 0;

  @observable public currentAction: ACTIONS_TYPE;
  @observable public currentActionStep: number = 0;
  @observable public maxAmount: number = 0;
  @observable public currentActionStatus: statusFetching = 'init';

  stepTitles: Record<ACTIONS_TYPE, string> = {
    PAY_BACK_DAI: 'Pay Back Dai',
    GENERATE_DAI: 'Generate Dai',
    WITHDRAWAL_ONE: 'Withdrawal ONE',
  };

  actionSteps: Record<ACTIONS_TYPE, string[]> = {
    PAY_BACK_DAI: ['Step 1', 'Step 2', 'Step 3'],
    GENERATE_DAI: ['Step 1', 'Step 2', 'Step 3'],
    WITHDRAWAL_ONE: ['Step 1', 'Step 2', 'Step 3'],
  };

  steps = [
    'Converting ONEs to collateralizable assets',
    'Approve collateralization contract to withdraw specified amount of assets',
    'Approve collateralization contract to add user collateral to the system',
    'Approve accounting contract to perform CDP manipulations to add user collaterals and debts',
    "Approve DAI contract to access the accounting system on user's behalf",
    'Approve DAI contract to mint DAI for the user',
  ];

  constructor(stores: IStores) {
    super(stores);

    fetch('https://api.binance.com/api/v1/ticker/price?symbol=ONEUSDT')
      .then(response => response.json())
      .then(data => (this.currentOnePrice = data.price));
  }

  @observable formData = {
    amount: 0,
    amountDai: 0,
  };

  @observable minCollateralizationRatio = 150;
  @observable liquidationRatio = 1.5;
  @observable currentOnePrice = 0.009;
  //
  // Your collateralization ratio (collateralized ones/dais generated), aka rate: ones/dai
  //
  // Liquidation ratio (set by governors): 150%
  //
  // Your liquidation price: (dai * liquidation_ratio)/ones
  //
  // Current one price: Read the ONE price from here: https://api.binance.com/api/v1/ticker/price?symbol=ONEUSDT
  //
  // Stability fee: 2.5% per year
  //
  // Max dai available to generate: (ones * current_one_price)/rate

  @computed
  get feeds() {
    const ones = parseInt(String(this.formData.amount));
    const dai = parseInt(String(this.formData.amountDai));

    if (ones && dai) {
      const rate = ones / dai;

      return {
        сollateralizationRatio: rate,
        liquidationPrice: (dai * this.liquidationRatio) / ones,
        currentPrice: this.currentOnePrice,
        stabilityFee: 2.5,
        maxDaiAvailable: ones / 150,
      };
    } else {
      return {
        сollateralizationRatio: 150,
        liquidationPrice: this.currentOnePrice,
        currentPrice: this.currentOnePrice,
        stabilityFee: 2.5,
        maxDaiAvailable: ones ? ones / 150 : 0,
      };
    }
  }

  @computed
  get totalFeeds() {
    const ones = parseInt(this.stores.user.vat.ink);
    const dai = parseInt(this.stores.user.vat.art);

    const maxDai = ones ? ones / 150 : 0;

    if (ones && dai) {
      const rate = ones / dai;

      return {
        сollateralizationRatio: rate,
        liquidationPrice: (dai * this.liquidationRatio) / ones,
        currentPrice: this.currentOnePrice,
        stabilityFee: 2.5,
        maxDaiAvailable: ones / 150,
        ableToWithDraw: (maxDai - dai) * 150,
        ableToGenerate: maxDai - dai,
      };
    } else {
      return {
        сollateralizationRatio: 150,
        liquidationPrice: this.currentOnePrice,
        currentPrice: this.currentOnePrice,
        stabilityFee: 2.5,
        maxDaiAvailable: 22000,
        ableToWithDraw: (maxDai - dai) * 150,
        ableToGenerate: maxDai - dai,
      };
    }
  }

  @action.bound
  setCurrentAction(action: ACTIONS_TYPE, maxAmount: number) {
    this.currentAction = action;
    this.maxAmount = maxAmount;
  }

  @action.bound
  setCurrentActionStep(step: number) {
    this.currentActionStep = step;
  }

  callAction = action => {
    return new Promise(async (resolve, reject) => {
      this.actionStatus = 'fetching';

      try {
        if (Number(this.maxAmount) < Number(this.formData.amount)) {
          throw new Error('Max amount is ' + this.maxAmount);
        }

        await action();

        this.actionStatus = 'success';

        setTimeout(() => resolve(), 2000);
      } catch (e) {
        console.error(e);

        this.error = typeof e === 'string' ? e : e.message;

        this.actionStatus = 'error';

        reject(e.message);
      }
    });
  };

  @action.bound
  paybackDai(daiAmount: number) {
    return this.callAction(() =>
      blockchain.paybackDai(
        this.stores.user.address,
        daiAmount,
        this.setCurrentActionStep,
      ),
    );
  }

  @action.bound
  generateDai(daiAmount: number) {
    return this.callAction(() =>
      blockchain.generateDai(
        this.stores.user.address,
        daiAmount,
        this.setCurrentActionStep,
      ),
    );
  }

  @action.bound
  open(gemAmount: number, daiAmount: number) {
    this.actionStatus = 'fetching';
    this.currentStep = 0;

    return new Promise(async (resolve, reject) => {
      try {
        if (
          Number(this.stores.user.balance) < Number(this.formData.amount * 1e18)
        ) {
          throw new Error('Your balance is not enough to buy');
        }

        await blockchain.buyGem(this.stores.user.address, gemAmount);

        await blockchain.borrow(
          this.stores.user.address,
          gemAmount,
          daiAmount,
          num => (this.currentStep = num),
        );

        this.actionStatus = 'success';

        setTimeout(() => resolve(), 2000);
        //
        // this.error = 'Transaction failed';
        //
        // this.actionStatus = 'error';
        // reject();
      } catch (e) {
        console.error(e);

        this.error = typeof e === 'string' ? e : e.message;

        this.actionStatus = 'error';

        reject(e.message);
      }
    });
  }

  @action.bound
  clear() {
    this.currentPlayer = null;
    this.status = 'init';
    this.actionStatus = 'init';
    this.txId = '';
    this.error = '';
    this.formData = {
      amount: 0,
      amountDai: 0,
    };
    this.currentStep = 0;

    // this.currentAction
    this.currentActionStep = 0;
    this.maxAmount = 0;
    this.currentActionStatus = 'init';
  }
}
