import { allJson, connectToOneWallet, hmy, sendMethods } from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/dai.sol:Dai'].abi),
  process.env.DAI,
);

daiContract.wallet.createAccount();

// dai contract run by admin to mint dai
let daiJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/join.sol:DaiJoin'].abi),
  process.env.DAIJOIN,
);

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/vat.sol:Vat'].abi),
  process.env.VAT,
);

let ilk = hexlify(toUtf8Bytes('HarmonyERC20'));

export const paybackDai = async (address, daiAmount, setStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(daiContract.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      const methods = [
        daiContract.methods.approve(process.env.DAIJOIN, daiAmount),
        daiJoinContract.methods.join(addrHex, daiAmount),
        vatContract.methods.frob(ilk, addrHex, addrHex, addrHex, 0, -daiAmount)
      ];

      await sendMethods(methods, reject, setStep);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
