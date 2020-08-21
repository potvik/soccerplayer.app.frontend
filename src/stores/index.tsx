import RouterStore from 'stores/RouterStore';
import { ModalsStore } from './ModalsStore';
import { ActionModalsStore } from './ActionModalsStore';
import { UserStoreEx } from './UserStore';
import { UserStoreMetamask } from './UserStoreMetamask';
import { SoccerPlayersList } from './SoccerPlayersList';
import { BuySoccerPlayer } from './BuySoccerPlayer';
import { OpenVault } from './OpenVault';
import { Exchange } from './Exchange';
import { createStoresContext } from './create-context';

export interface IStores {
  routing?: RouterStore;
  modal?: ModalsStore;
  actionModals?: ActionModalsStore;
  user?: UserStoreEx;
  userMetamask?: UserStoreMetamask;
  soccerPlayers?: SoccerPlayersList;
  buyPlayer?: BuySoccerPlayer;
  openVault?: OpenVault;
  exchange?: Exchange;
}

const stores: IStores = {};

stores.routing = new RouterStore();
stores.modal = new ModalsStore();
stores.actionModals = new ActionModalsStore();
stores.user = new UserStoreEx();
stores.userMetamask = new UserStoreMetamask(stores);
stores.soccerPlayers = new SoccerPlayersList(stores);
stores.buyPlayer = new BuySoccerPlayer(stores);
stores.openVault = new OpenVault(stores);
stores.exchange = new Exchange(stores);

if (!process.env.production) {
  window.stores = stores;
}

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;
