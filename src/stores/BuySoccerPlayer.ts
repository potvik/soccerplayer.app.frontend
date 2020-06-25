import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import { IPlayerCard } from './SoccerPlayersList';
import * as blockchain from '../blockchain';

export class BuySoccerPlayer extends StoreConstructor {
  @observable public currentPlayer: IPlayerCard;

  @observable public status: statusFetching = 'init';

  constructor(stores: IStores) {
    super(stores);
  }

  @action.bound
  buy() {
    this.status = 'fetching';

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.status = 'success';

        reject()

        // resolve()
      }, 3000);
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
