import { allJson, connectToOneWallet, hmy, options1, options2 } from './sdk';

const { toUtf8Bytes } = require('@harmony-js/contract');
const { hexlify } = require('@harmony-js/crypto');
const { hexToNumber } = require('@harmony-js/utils');

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

// dai contract run by admin to mint dai
let daiJoinContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/join.sol:DaiJoin'].abi),
  process.env.DAIJOIN,
);

let vatContract = hmy.contracts.createContract(
  JSON.parse(allJson.contracts['src/vat.sol:Vat'].abi),
  process.env.VAT,
);

// gemJoinContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
// daiJoinContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);
// vatContract.wallet.addByPrivateKey(process.env.PRIVATE_KEY);

let ilk = hexlify(toUtf8Bytes('HarmonyERC20'));

export const borrow = async (address, gemAmount, daiAmount, setCurrentStep) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(gemContract.wallet, address, reject);

      const addrHex = hmy.crypto.getAddress(address).checksum;

      //////////// STEP 1 ////////////
      setCurrentStep(1);

      let gas = await gemContract.methods['approve(address,uint256)'](
        process.env.GEMJOIN,
        gemAmount,
      ).estimateGas(options1);

      await gemContract.methods['approve(address,uint256)'](
        process.env.GEMJOIN,
        gemAmount,
      ).send({ ...options2, gasLimit: hexToNumber(gas) }); // user must approve GEMJOIN to withdraw gems

      //////////// STEP 2 ////////////
      setCurrentStep(2);

      gas = await gemJoinContract.methods
        .join(addrHex, gemAmount)
        .estimateGas(options1);

      await gemJoinContract.methods
        .join(addrHex, gemAmount)
        .send({ ...options2, gasLimit: hexToNumber(gas) });

      //////////// STEP 3 ////////////
      setCurrentStep(3);

      // gas = await vatContract.methods
      //   .frob(ilk, addrHex, addrHex, addrHex, gemAmount, daiAmount)
      //   .estimateGas(options1);

      await vatContract.methods
        .frob(ilk, addrHex, addrHex, addrHex, gemAmount, daiAmount)
        .send({ ...options2, gasLimit: 6721900 });

      //////////// STEP 4 ////////////
      setCurrentStep(4);

      // gas = await vatContract.methods
      //   .hope(process.env.DAIJOIN)
      //   .estimateGas(options1);

      await vatContract.methods
        .hope(process.env.DAIJOIN)
        .send({ ...options2, gasLimit: 25000 });

      //////////// STEP 5 ////////////
      setCurrentStep(5);

      gas = await daiJoinContract.methods
        .exit(addrHex, daiAmount)
        .estimateGas(options1);

      await daiJoinContract.methods
        .exit(addrHex, daiAmount)
        .send({ ...options2, gasLimit: hexToNumber(gas) });

      resolve(true);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
