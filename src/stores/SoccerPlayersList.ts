import { action, computed, observable } from 'mobx';
import { IStores } from 'stores';
import { statusFetching } from '../constants';
import { StoreConstructor } from './core/StoreConstructor';
import * as blockchain from '../blockchain';
import { getBech32Address } from '../blockchain';

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

export enum PLAYERS_FILTER {
  TOP = 'TOP',
  ALL = 'ALL',
  MY = 'MY',
}

export class SoccerPlayersList extends StoreConstructor {
  @observable public list: Array<{
    emptyPlayer: IEmptyPlayerCard;
    player?: IPlayerCard;
  }> = [];
  @observable public status: statusFetching = 'init';

  @observable public filter: PLAYERS_FILTER = PLAYERS_FILTER.ALL;
  @observable public sort: keyof IPlayerCard = 'sellingPrice';

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
    }, 7000);
  }

  @computed
  public get filteredList() {
    switch (this.filter) {
      case PLAYERS_FILTER.ALL:
        return this.list
          .slice()
          .filter(item => !!item.player)
          .sort((a, b) => {
            if (this.sort === 'sellingPrice') {
              return a.player[this.sort] <= b.player[this.sort] ? 1 : -1;
            }
            return a.player[this.sort] <= b.player[this.sort] ? -1 : 1;
          });
      case PLAYERS_FILTER.TOP:
        const list = this.list
          .slice()
          .filter(item => !!item.player)
          .sort((a, b) =>
            a.player.sellingPrice <= b.player.sellingPrice ? 1 : -1,
          );

        return list.slice(0, 5);
      case PLAYERS_FILTER.MY:
        return this.list.filter(
          item =>
            getBech32Address(item.player.owner) === this.stores.user.address,
        );
      default:
        return this.list;
    }
  }

  @action.bound
  async setFilter(filter: PLAYERS_FILTER) {
    this.filter = filter;
  }

  @action.bound
  async setSort(sort: keyof IPlayerCard) {
    this.sort = sort;
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

        if (this.status === 'first_fetching') {
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

        this.status = 'success';
      })
      .catch(e => {
        console.error(e.message);
        this.status = 'error';
      });
  }
}
