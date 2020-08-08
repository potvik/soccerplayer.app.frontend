import { allJson, hmy, options2 } from './sdk';

const contractJson = allJson.contracts['src/dai.sol:Dai'];
const abi = JSON.parse(contractJson.abi);
const contract = hmy.contracts.createContract(abi, process.env.DAI);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

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

// GEM //

const contractJsonGem = allJson.contracts['lib/ds-token/src/token.sol:DSToken'];
const abiGem = JSON.parse(contractJsonGem.abi);
const contractGem = hmy.contracts.createContract(abiGem, process.env.GEM);

contractGem.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

export const getBalanceGem = address => {
  try {
    const addrHex = hmy.crypto.getAddress(address).checksum;

    return contractGem.methods.balanceOf(addrHex).call(options2);
  } catch (e) {
    console.error(e);
    return 0;
  }
};
