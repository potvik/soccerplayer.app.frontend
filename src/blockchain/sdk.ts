const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

export const EXPLORER_URL = 'https://explorer.harmony.one/#';

export const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  'https://api.s0.b.hmny.io',
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  },
);

export const hmyGem = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  'https://api.s0.b.hmny.io',
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  },
);

export const options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

export const allJson = require('./out/dapp.sol.json');

export const connectToOneWallet = (wallet, address) => {
  wallet.defaultSigner = address;

  wallet.signTransaction = async tx => {
    try {
      tx.from = address;

      // @ts-ignore
      const signTx = await window.onewallet.signTransaction(tx);

      return signTx;
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }

    return null;
  };
}
