import { allJson, connectToOneWallet, hmy, sendMethods } from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

let daiContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/dai.sol:Dai'].abi),
  process.env.DAI,
);
daiContract.wallet.createAccount()

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

export const withdrawOne = async (address, gemAmount, setStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(daiContract.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      const methods = [
        vatContract.methods.frob(ilk, addrHex, addrHex, addrHex, -gemAmount, 0),
        gemJoinContract.methods.exit(addrHex, gemAmount),
      ];

      await sendMethods(methods, reject, setStep);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
