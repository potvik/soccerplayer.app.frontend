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
const contractAddr = '0x16B729874BD8d54A1a3b5d2B0Ff344d3C6604eE0';

const soccerPlayers = hmy.contracts.createContract(
  contractJson.abi,
  contractAddr,
);

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

export const getBech32Address = (address) => hmy.crypto.getAddress(address).bech32;
