const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

export const EXPLORER_URL = 'https://explorer.harmony.one/#';

const hmy = new Harmony(
  // let's assume we deploy smart contract to this end-point URL
  'https://api.s0.b.hmny.io',
  {
    chainType: ChainType.Harmony,
    chainId: ChainID.HmyTestnet,
  },
);

const allJson = require('./out/dapp.sol.json');
const contractJson = allJson.contracts['src/dai.sol:Dai'];
const abi = JSON.parse(contractJson.abi);
const contract = hmy.contracts.createContract(abi, process.env.DAI);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let options2 = { gasPrice: 1000000000, gasLimit: 6721900 };

export const getBalanceDai = address => {
  try {
    const addrHex = hmy.crypto.getAddress(address).checksum;

    return contract.methods.balanceOf(addrHex).call(options2);
  } catch (e) {
    console.error(e);
    return 0;
  }
};

export const getBech32Address = address =>
  hmy.crypto.getAddress(address).bech32;

export const getBalance = address => {
  return hmy.blockchain.getBalance({ address });
};
