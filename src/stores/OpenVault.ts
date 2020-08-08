import { action, computed, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain';

export class OpenVault extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';
  @observable public actionStatus: statusFetching = 'init';
  @observable public txId: string;
  @observable public error: string;
  @observable public hasVault: boolean = false;

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
        maxDaiAvailable: (ones * this.currentOnePrice) / rate,
      };
    } else {
      return {
        сollateralizationRatio: 150,
        liquidationPrice: this.currentOnePrice,
        currentPrice: this.currentOnePrice,
        stabilityFee: 2.5,
        maxDaiAvailable: 22000,
      };
    }
  }

  @action.bound
  open(gemAmount: number, daiAmount: number) {
    this.actionStatus = 'fetching';

    return new Promise(async (resolve, reject) => {
      try {
        // if (
        //   Number(this.stores.user.balance) <
        //   Number(this.currentPlayer.sellingPrice)
        // ) {
        //   throw new Error('Your balance is not enough to buy');
        // }

        await blockchain.buyGem(
          this.stores.user.address,
          Number(gemAmount * 1e18),
        );

        await blockchain.borrow(this.stores.user.address, gemAmount, daiAmount);

        this.actionStatus = 'success';

        this.hasVault = true;

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
  }
}
