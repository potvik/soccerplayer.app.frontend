import { action, observable } from 'mobx';
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
  }

  @observable feeds = {
    сollateralizationRatio: 150,
    liquidationPrice: 0.008,
    currentPrice: 0.006,
    stabilityFee: 2.5,
    maxDaiAvailable: 22000,
  };

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

        // await blockchain.buyGem(
        //   this.stores.user.address,
        //   Number(gemAmount * 1e18),
        // );
        await blockchain.borrow(this.stores.user.address, gemAmount, daiAmount);

        this.actionStatus = 'success';

        setTimeout(() => resolve(), 2000);
        //
        // this.error = 'Transaction failed';
        //
        // this.actionStatus = 'error';
        // reject();
      } catch (e) {
        console.error(e);
        this.error = e.message;

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
  }
}
