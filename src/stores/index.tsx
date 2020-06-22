import RouterStore from 'stores/RouterStore';
import { ModalsStore } from './ModalsStore';
import { UserStoreEx } from './UserStore';
import { createStoresContext } from './create-context';


export interface IStores {
  routing?: RouterStore;
  modal?: ModalsStore;
  user?: UserStoreEx;
}

const stores: IStores = {};

stores.routing = new RouterStore();
stores.modal = new ModalsStore();
stores.user = new UserStoreEx();

if (!process.env.production) {
  window.stores = stores;
}

const { StoresProvider, useStores } = createStoresContext<typeof stores>();
export { StoresProvider, useStores };

export default stores;
