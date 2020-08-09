import { allJson, connectToOneWallet, hmy, ONE, sendMethods } from './sdk';
const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');

let gemContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['lib/ds-token/src/token.sol:DSToken'].abi),
  process.env.GEM,
);

gemContract.wallet.createAccount();

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

export const depositOne = async (address, gemAmount, setStep) => {
  const setStepR = n => setStep(n + 1);

  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(gemContract.wallet, address, reject);
      connectToOneWallet(gemJoinContract.wallet, address, reject);
      connectToOneWallet(vatContract.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      const methods = [
        gemContract.methods['approve(address,uint256)'](
          process.env.GEMJOIN,
          gemAmount,
        ),
        gemJoinContract.methods.join(addrHex, gemAmount),
        vatContract.methods.frob(ilk, addrHex, addrHex, addrHex, gemAmount, 0),
      ];

      await sendMethods(methods, reject, setStepR);

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
