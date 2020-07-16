import RouterStore from 'stores/RouterStore';
import { ModalsStore } from './ModalsStore';
import { ActionModalsStore } from './ActionModalsStore';
import { UserStoreEx } from './UserStore';
import { SoccerPlayersList } from './SoccerPlayersList';
import { BuySoccerPlayer } from './BuySoccerPlayer';
import { SendSoccerPlayer } from './SendSoccerPlayer';
import { createStoresContext } from './create-context';


export interface IStores {
  routing?: RouterStore;
  modal?: ModalsStore;
  actionModals?: ActionModalsStore;
  user?: UserStoreEx;
  soccerPlayers?: SoccerPlayersList;
  buyPlayer?: BuySoccerPlayer;
  sendPlayer?: SendSoccerPlayer;
}

const stores: IStores = {};

stores.routing = new RouterStore();
stores.modal = new ModalsStore();
stores.actionModals = new ActionModalsStore();
stores.user = new UserStoreEx();
stores.soccerPlayers = new SoccerPlayersList(stores);
stores.buyPlayer = new BuySoccerPlayer(stores);
stores.sendPlayer = new SendSoccerPlayer(stores);

if (!process.env.production) {
  window.stores = stores;
}

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;
