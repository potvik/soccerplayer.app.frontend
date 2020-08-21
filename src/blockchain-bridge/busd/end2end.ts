import { sleep, BLOCK_TO_FINALITY, AVG_BLOCK_TIME } from '../utils';

import * as eth from './eth';
import * as hmyMethos from './hmy';
import { web3 } from '../ethSdk';
import { hmy } from '../sdk';
import BN from 'bn.js';

export const busd = '0x22d90673720A9d83D2BdE59AA604ABeBFF90fC1c';
export const busdHmy = '0xc496f1010d3c052f6e8ba402d05832540f4cb803';
export const hmyManager = '0xa2d6f0e9ef3b83b3cb069d5006895a5257b8655b';

export const getEthBalanceBUSD = async ethAddress => {
  return await eth.checkEthBalance(busd, ethAddress);
};

export const getHmyBalanceBUSD = async hmyAddress => {
  const addrHex = hmy.crypto.getAddress(hmyAddress).checksum;

  return await hmyMethos.checkHmyBalance(busdHmy, addrHex);
};

export const getEthBalance = (ethAddress): Promise<string> => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(ethAddress, (err, balance) => {
      if (err) {
        reject(err);
      }

      // const rez = String(new BN(balance).div(new BN(1e18)));

      resolve(String(Number(balance) / 1e18));
    });
  });
};

export const ethToOneBUSD = async ({
  amount,
  ethUserAddress,
  hmyUserAddress,
}) => {
  // user approve eth manager to lock tokens
  try {
    console.log(1);

    await eth.approveEthManger(amount);

    console.log(2);

    // wait sufficient to confirm the transaction went through
    const lockedEvent = await eth.lockToken(hmyUserAddress, amount);

    console.log(3);

    const expectedBlockNumber = lockedEvent.blockNumber + BLOCK_TO_FINALITY;

    console.log(4);

    while (true) {
      let blockNumber = await web3.eth.getBlockNumber();
      if (blockNumber <= expectedBlockNumber) {
        console.log(
          `Currently at block ${blockNumber}, waiting for block ${expectedBlockNumber} to be confirmed`,
        );
        await sleep(AVG_BLOCK_TIME);
      } else {
        break;
      }
    }

    console.log(5);

    const recipient = lockedEvent.returnValues.recipient;

    await hmyMethos.mintToken(
      hmyManager,
      recipient,
      amount,
      lockedEvent.transactionHash,
    );

    console.log(6);
  } catch (e) {
    console.error(e);
  }
};

// // user needs to approve hmy manager to burn token
// await approveHmyManger(busdHmy, hmyManager, amount);
//
// // hmy burn tokens, transaction is confirmed instantaneously, no need to wait
// let txHash = await burnToken(hmyManager, userAddr, amount);
//
// await unlockToken(ethManager, userAddr, amount, txHash);
