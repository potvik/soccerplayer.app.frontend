import {
  allJson,
  connectToOneWallet,
  contractJson,
  hmy,
  ONE,
  sendMethods,
} from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/dai.sol:Dai'].abi),
  process.env.DAI,
);

daiContract.wallet.createAccount();

// // user will collateralize gems using gem join contract
let gemJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/join.sol:GemJoin'].abi),
  process.env.GEMJOIN,
);

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/vat.sol:Vat'].abi),
  process.env.VAT,
);

var ilk = hexlify(toUtf8Bytes('HarmonyERC20'));

const gemAbi = contractJson.abi;
const contractAddr = process.env.PAYMENT;
let gemContract = hmy.contracts.createContract(gemAbi, contractAddr);

const contractJsonDS = allJson.contracts['lib/ds-token/src/token.sol:DSToken'];
const abiDS = JSON.parse(contractJsonDS.abi);
const contractAddrDS = process.env.GEM;
let contractDS = hmy.contracts.createContract(abiDS, contractAddrDS);
contractDS.wallet.createAccount();

export const withdrawOne = async (address, gemAmount, setStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(daiContract.wallet, address, reject);
      connectToOneWallet(gemContract.wallet, address, reject);
      connectToOneWallet(contractDS.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      const methods = [
        vatContract.methods.frob(ilk, addrHex, addrHex, addrHex, -gemAmount, 0),
        gemJoinContract.methods.exit(addrHex, gemAmount),
        contractDS.methods['approve(address)'](process.env.PAYMENT),
        gemContract.methods.withdraw(String(gemAmount) + ONE),
      ];

      await sendMethods(methods, reject, setStep);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};

export const withdrawGem = async (address, gemAmount, setStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(gemContract.wallet, address, reject);
      connectToOneWallet(contractDS.wallet, address, reject);

      const methods = [
        contractDS.methods['approve(address)'](process.env.PAYMENT),
        gemContract.methods.withdraw(String(gemAmount) + ONE),
      ];

      await sendMethods(methods, reject, setStep);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
