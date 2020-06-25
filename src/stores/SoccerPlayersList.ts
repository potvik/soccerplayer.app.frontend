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
  player_img?: string; // link to player image
  empty?: false;
  transactionCount: number;
}

export interface IEmptyPlayerCard {
  internalPlayerId: string;
  empty: true;
}

export class SoccerPlayersList extends StoreConstructor {
  @observable public list: Array<{
    emptyPlayer: IEmptyPlayerCard;
    player?: IPlayerCard;
  }> = [];
  @observable public status: statusFetching = 'init';

  constructor(stores: IStores) {
    super(stores);

    // this.list = [...new Array(Number(10))].map((raw, idx) => ({
    //   emptyPlayer: {
    //     internalPlayerId: String(idx + 1),
    //     empty: true,
    //   },
    // }));

    // this.status = 'success';

    setInterval(() => {
      this.getList();
    }, 15000);
  }

  @action.bound
  async updatePlayerCard(id: string) {
    const fullPlayerData = await blockchain.getPlayerById(id);

    const playerIndex = this.list.findIndex(
      item => item.player.internalPlayerId === id,
    );

    this.list[playerIndex] = {
      ...this.list[playerIndex],
      player: fullPlayerData,
    };

    this.list = this.list
      .slice()
      .sort((a, b) =>
        a.player.sellingPrice <= b.player.sellingPrice ? 1 : -1,
      );
  }

  @action.bound
  getList() {
    if (this.status === 'init') {
      this.status = 'first_fetching';
    } else {
      this.status = 'fetching';
    }

    blockchain
      .getTotalPlayers()
      .then(async total => {
        // this.status = 'success';

        if(this.status === 'first_fetching') {
          this.list = [...new Array(Number(total))].map((raw, idx) => ({
            emptyPlayer: {
              internalPlayerId: String(idx),
              empty: true,
            },
          }));
        }

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
        //
        // for (let i = 0; i < this.list.length; i++) {
        //   const player = this.list[i];
        //
        //   const fullPlayerData = await blockchain.getPlayerById(
        //     player.emptyPlayer.internalPlayerId,
        //   );
        //
        //   this.list[i] = {
        //     ...player,
        //     player: fullPlayerData,
        //   };
        // }

        await Promise.all(
          this.list.map(async (player, idx) => {
            const fullPlayerData = await blockchain.getPlayerById(
              player.emptyPlayer.internalPlayerId,
            );

            this.list[idx] = {
              ...this.list[idx],
              player: fullPlayerData,
            };
          }),
        );

        this.list = this.list.sort((a, b) =>
          a.player && b.player && a.player.sellingPrice <= b.player.sellingPrice
            ? 1
            : -1,
        );

        this.status = 'success';
      })
      .catch(e => {
        console.error(e.message);
        this.status = 'error';
      });
  }
}
