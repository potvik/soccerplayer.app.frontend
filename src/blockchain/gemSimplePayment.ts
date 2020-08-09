import { connectToOneWallet, hmy, options1, options2 } from './sdk';
// GEM SimplePayment //
const { hexToNumber, numberToHex } = require('@harmony-js/utils');

const contractJson = require('./out/SimplePayment.json');
const abi = contractJson.abi;
const contractAddr = process.env.PAYMENT;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.createAccount();

export const buyGem = async (address, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(contract.wallet, address, reject);

      const ONE = '000000000000000000';

      const amountHex = numberToHex(amount.toString() + ONE);
      const plus1Hex = numberToHex((Number(amount) + 1).toString() + ONE);

      // const gas = await contract.methods
      //   .deposit(hexToNumber(amountHex))
      //   .estimateGas(options1);

      // const options = {
      //   ...options2,
      //   value: plus1Hex,
      //   gasLimit: 6721900, // hexToNumber(gas),
      // };

      let options = { gasPrice: 1000000000, gasLimit: 6721900, value: plus1Hex };
      
      const response = await contract.methods
        .deposit(hexToNumber(amountHex))
        .send(options);

      if (response.transaction.txStatus !== 'CONFIRMED') {
        throw new Error('buyGem tx - rejected');
      }

      resolve(response);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};

// const ONE = "000000000000000000";
// const amount = parseInt(args[1], 10);
// const amountHex = numberToHex(amount.toString() + ONE);
// const plus1Hex = numberToHex((amount + 1).toString() + ONE);
//
// const contractJson = require("../../out/SimplePayment.json");
// var abi = contractJson.abi;
// const contractAddr = process.env.PAYMENT;
//
// let contract = hmy.contracts.createContract(abi, contractAddr);
// contract.wallet.addByPrivateKey(process.env.PRIVATE_KEY_USER);
//
// let options2 = { gasPrice: 1000000000, gasLimit: 6721900, value: plus1Hex };
//
// contract.methods
//   .deposit(hexToNumber(amountHex))
//   .send(options2)
//   .then((response) => {
//     if (response.transaction.txStatus == "REJECTED") {
//       console.log("Reject");
//       process.exit(0);
//     }
//     console.log(response);
//     process.exit(0);
//   });
