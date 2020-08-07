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
