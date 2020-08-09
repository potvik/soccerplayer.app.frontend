import { allJson, connectToOneWallet, hmy, sendMethods } from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

// dai contract run by admin to mint dai
let daiJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/join.sol:DaiJoin'].abi),
  process.env.DAIJOIN,
);

daiJoinContract.wallet.createAccount();

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/vat.sol:Vat'].abi),
  process.env.VAT,
);

let ilk = hexlify(toUtf8Bytes('HarmonyERC20'));

export const generateDai = async (address, daiAmount, setStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(vatContract.wallet, address, reject);
      connectToOneWallet(daiJoinContract.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      const methods = [
        vatContract.methods.frob(ilk, addrHex, addrHex, addrHex, 0, daiAmount),
        vatContract.methods.hope(process.env.DAIJOIN),
        daiJoinContract.methods.exit(addrHex, daiAmount),
      ];

      await sendMethods(methods, reject, setStep);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
