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
    сollateralizationRatio: 192.3,
    liquidationPrice: 0.008,
    currentPrice: 0.006,
    stabilityFee: 0.006,
    maxDaiAvailable: 22000,
  }

  @action.bound
  open() {
    this.actionStatus = 'fetching';

    return new Promise(async (resolve, reject) => {
      try {
        if (
          Number(this.stores.user.balance) <
          Number(this.currentPlayer.sellingPrice)
        ) {
          throw new Error('Your balance is not enough to buy');
        }

        const res = await blockchain.buyPlayerById({
          id: this.currentPlayer.internalPlayerId,
          price: this.currentPlayer.sellingPrice,
          signer: this.stores.user.address,
        });

        this.txId = res.transaction.id;

        if (res.status === 'called' || res.status === 'call') {
          this.stores.soccerPlayers.updatePlayerCard(
            this.currentPlayer.internalPlayerId,
          );

          this.actionStatus = 'success';

          setTimeout(() => resolve(), 2000);

          return;
        }

        this.error = 'Transaction failed';

        this.actionStatus = 'error';
        reject();
      } catch (e) {
        console.error(e);
        this.error = e.message;

        this.actionStatus = 'error';

        reject(e.message);
      }
    });
  }

  @action.bound
  initPlayer(player: IPlayerCard) {
    this.currentPlayer = player;
    this.status = 'success';

    blockchain.getPlayerById(player.internalPlayerId).then(player => {
      this.currentPlayer = player;

      return Promise.resolve(player);
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
