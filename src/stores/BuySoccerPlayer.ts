import { action, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import * as blockchain from '../blockchain';

export interface IPlayerCard {
  internalPlayerId: string;
  owner: string;
  playerName: string;
  sellingPrice: string;
  transactions?: number;
  player_img?: string; // link to player image
  empty?: false;
}

export interface IEmptyPlayerCard {
  internalPlayerId: string;
  empty: true;
}

export class BuySoccerPlayer extends StoreConstructor {
  @observable public list: Array<{
    emptyPlayer: IEmptyPlayerCard;
    player?: IPlayerCard;
  }> = [];
  @observable public status: statusFetching = 'init';

  constructor(stores: IStores) {
    super(stores);

    this.list = [...new Array(Number(10))].map((raw, idx) => ({
      emptyPlayer: {
        internalPlayerId: String(idx),
        empty: true,
      },
    }));

    this.status = 'success';
  }

  @action.bound
  getList() {
    this.status = 'fetching';

    blockchain.getList();

    blockchain
      .getTotalPlayers()
      .then(async total => {
        this.status = 'success';

        this.list = [...new Array(Number(total))].map((raw, idx) => ({
          emptyPlayer: {
            internalPlayerId: String(idx),
            empty: true,
          },
        }));

        // this.list.forEach(async (player, idx) => {
        //   const fullPlayerData = await blockchain.getPlayerById(
        //     player.emptyPlayer.internalPlayerId,
        //   );
        //
        //   this.list[idx] = {
        //     ...this.list[idx],
        //     player: fullPlayerData,
        //   };
        // });

        for (let i = 0; i < this.list.length; i++) {
          const player = this.list[i];

          const fullPlayerData = await blockchain.getPlayerById(player.emptyPlayer.internalPlayerId);

          this.list[i] = {
            ...player,
            player: fullPlayerData,
          };
        }
      })
      .catch(e => {
        console.error(e.message);
        this.status = 'error';
      });
  }
}
