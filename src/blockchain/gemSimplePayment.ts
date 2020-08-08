import { connectToOneWallet, hmy, options2 } from './sdk';
// GEM SimplePayment //
const { hexToNumber } = require('@harmony-js/utils');

const contractJson = require('./out/SimplePayment.json');
const abi = contractJson.abi;
const contractAddr = process.env.PAYMENT;

let contract = hmy.contracts.createContract(abi, contractAddr);
contract.wallet.createAccount();

export const buyGem = async (address, amount) => {
  return new Promise(async (resolve, reject) => {
    try {
      connectToOneWallet(contract.wallet, address, reject);

      const hexAmount = '0x' + Number(amount).toString(16);

      const options = { ...options2, value: hexAmount };

      const response = await contract.methods
        .deposit(hexToNumber(hexAmount))
        .send(options);

      if (response.transaction.txStatus === 'REJECTED') {
        throw new Error('buyGem tx - rejected');
      }

      resolve(response);
    } catch (e) {
      console.error(e);

      reject(e);
    }
  });
};
