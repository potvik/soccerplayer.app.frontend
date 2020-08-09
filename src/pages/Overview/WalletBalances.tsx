import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Title, Text, Button } from 'components/Base';
import cn from 'classnames';
import * as styles from './wallet-balances.styl';
import { formatWithTwoDecimals, ones } from 'utils';
import { useStores } from '../../stores';
import { ACTIONS_TYPE } from '../../stores/OpenVault';
import { CloseVaultModal } from '../CloseVault';
import { MakerActionModal } from '../MakerActionModal';

const AssetRow = observer<any>(props => {
  const { user, actionModals, openVault } = useStores();

  return (
    <Box
      className={cn(
        styles.walletBalancesRow,
        props.last ? '' : styles.underline,
      )}
    >
      <Box>
        <Text bold={false}>{props.asset}</Text>
      </Box>

      <Box direction="column" align="end">
        <Box className={styles.priceColumn}>
          <Text bold={true}>{props.value}</Text>
        </Box>

        {props.last && !!Number(user.balanceGem) ? (
          <Button
            style={{ width: '60px', margin: '-10px 0' }}
            transparent={true}
            onClick={() => {
              openVault.setCurrentAction(
                ACTIONS_TYPE.WITHDRAWAL_GEM,
                parseFloat(user.balanceGem),
              );

              actionModals.open(MakerActionModal, {
                title: '',
                applyText: 'Withdraw One',
                closeText: 'Cancel',
                noValidation: true,
                width: '600px',
                showOther: true,
                onApply: data => openVault.withdrawGem(data.amount),
                onClose: () => {
                  openVault.clear();
                  user.getBalances();
                  // setTimeout(() => user.getBalances(), 4000);
                },
              });
            }}
          >
            Withdraw
          </Button>
        ) : null}
      </Box>
    </Box>
  );
});

export const WalletBalances = observer(() => {
  const { user, openVault, actionModals } = useStores();

  return (
    <Box direction="column" className={styles.walletBalances}>
      <Title>Wallet Balances</Title>

      <Box className={styles.container}>
        <AssetRow
          asset="Available balance"
          value={formatWithTwoDecimals(ones(user.balance)) + ' ONE'}
        />

        <AssetRow
          asset="Outstanding Dai debt"
          value={formatWithTwoDecimals(user.balanceDai) + ' DAI'}
        />

        <AssetRow
          asset="Unlocked ONEs"
          value={formatWithTwoDecimals(user.balanceGem) + ' ONE'}
          last={true}
        />
      </Box>

      {openVault.hasVault ? (
        <Box margin={{ vertical: 'small' }}>
          <Button
            bgColor="rgb(0, 173, 232)"
            style={{ width: '100%' }}
            onClick={() => {
              openVault.setCurrentAction(ACTIONS_TYPE.CLOSE_VAULT, Number(0));

              actionModals.open(CloseVaultModal, {
                title: '',
                applyText: 'Close vault',
                closeText: 'Cancel',
                noValidation: true,
                width: '600px',
                showOther: true,
                onApply: data => openVault.closeVault(),
                onClose: () => {
                  openVault.clear();
                  user.getBalances();
                  // setTimeout(() => user.getBalances(), 4000);
                },
              });
            }}
          >
            Close Vault and withdraw all ONE
          </Button>
        </Box>
      ) : null}
    </Box>
  );
});
