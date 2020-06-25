import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain';

export class BuySoccerPlayer extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';
  @observable public actionStatus: statusFetching = 'init';

  constructor(stores: IStores) {
    super(stores);
  }

  @action.bound
  buy() {
    this.actionStatus = 'fetching';

    return new Promise(async (resolve, reject) => {
      try {
        const res = await blockchain.buyPlayerById({
          id: Number(this.currentPlayer.internalPlayerId),
          price: Number(this.currentPlayer.sellingPrice),
          signer: this.stores.user.address,
        });

        if (res.status === 'call') {
          await this.stores.soccerPlayers.updatePlayerCard(
            this.currentPlayer.internalPlayerId,
          );

          this.actionStatus = 'success';

          return resolve();
        }

        this.actionStatus = 'error';
        reject();
      } catch (e) {
        console.error(e);

        this.actionStatus = 'error';

        reject(e.message);
      }
    });
  }

  @action.bound
  initPlayer(player: IPlayerCard) {
    this.currentPlayer = player;
    this.status = 'success';

    return blockchain.getPlayerById(player.internalPlayerId).then(player => {
      this.currentPlayer = player;

      return Promise.resolve(player);
    });
  }

  @action.bound
  clear() {
    this.currentPlayer = null;
    this.status = 'init';
  }
}
