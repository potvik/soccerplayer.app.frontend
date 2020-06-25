import { computed } from 'mobx';

const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

const GAS_LIMIT = 6721900;
const GAS_PRICE = 1000000000;

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  'https://api.s0.b.hmny.io',
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  },
);

const contractJson = require('./SoccerPlayers.json');
// const contractAddr = '0x9B1714CADc6420f2Be1677BebfBCFca0e9be7Aa4';
const contractAddr = '0x7943381adde30f216cAEb9b9d1927522d7E5476f';

const soccerPlayers = hmy.contracts.createContract(
  contractJson.abi,
  contractAddr,
);

const a = soccerPlayers.wallet.createAccount();

// soccerPlayers.wallet.signTransaction = () => { console.log('SIGN') }

const options = {
  gasPrice: GAS_PRICE,
  gasLimit: GAS_LIMIT,
};

const instance = soccerPlayers.methods;

export const getList = async () => {
  let total = await instance.totalSupply().call(options);

  const cards = [];

  for (let i = 0; i < total; i++) {
    let res = await instance.getPlayer(i).call(options);
    cards.push(res);
  }

  return cards;
};

export const getPlayerById = async id => {
  const res = await instance.getPlayer(id).call(options);

  return res;
};

export const getTotalPlayers = async () => {
  const res = await instance.totalSupply().call(options);

  return res;
};

export const buyPlayerById = (params: {
  id: number;
  price: number;
  signer: string;
}): Promise<{ status: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      soccerPlayers.wallet.defaultSigner = params.signer;

      soccerPlayers.wallet.signTransaction = async tx => {
        try {
          tx.from = params.signer;
          // @ts-ignore
          const signTx = await window.harmony.signTransaction(tx);

          // const [sentTx, txHash] = await signTx.sendTransaction();

          // await sentTx.confirm(txHash);

          // resolve(txHash);
          return signTx;
        } catch (e) {
          console.error(e);
          reject(e.message);
        }

        return null;
      };

      const res = await soccerPlayers.methods
        .purchase(params.id)
        .send({ ...options, value: params.price });

      resolve(res);
    } catch (e) {
      console.error(e);

      reject(e.message);
    }
  });
};

export const getBech32Address = address =>
  hmy.crypto.getAddress(address).bech32;

export const getBalance = address => {
  return hmy.blockchain.getBalance({ address });
};
