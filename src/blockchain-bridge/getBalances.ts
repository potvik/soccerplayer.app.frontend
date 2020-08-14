import { allJson, hmy, options1, options2 } from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');
const { hexToNumber } = require('@harmony-js/utils');

const contractJson = allJson.contracts['src/dai.sol:Dai'];
const abi = JSON.parse(contractJson.abi);
const contract = hmy.contracts.createContract(abi, process.env.DAI);

contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

export const getBalanceDai = async address => {
  try {
    const addrHex = hmy.crypto.getAddress(address).checksum;

    const gas = await contract.methods.balanceOf(addrHex).estimateGas(options1);

    return contract.methods
      .balanceOf(addrHex)
      .call({ ...options2, gasLimit: hexToNumber(gas) });
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

export const getBalanceGem = async address => {
  try {
    const addrHex = hmy.crypto.getAddress(address).checksum;

    const gas = await contractGem.methods
      .balanceOf(addrHex)
      .estimateGas(options1);

    return contractGem.methods
      .balanceOf(addrHex)
      .call({ ...options2, gasLimit: hexToNumber(gas) });
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const vatContractJson = allJson.contracts['src/vat.sol:Vat'];
const vatAbi = JSON.parse(vatContractJson.abi);
const vatContract = hmy.contracts.createContract(vatAbi, process.env.VAT);
vatContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

const ilk = hexlify(toUtf8Bytes('HarmonyERC20'));

export const getVault = async address => {
  try {
    const addrHex = hmy.crypto.getAddress(address).checksum;

    // const gas = await vatContract.methods.urns(ilk, addrHex).estimateGas(options1);

    const res = await vatContract.methods
      .urns(ilk, addrHex)
      .call({ ...options2, gasLimit: 25000 });

    return res;
  } catch (e) {
    console.error(e);
    return 0;
  }
};
