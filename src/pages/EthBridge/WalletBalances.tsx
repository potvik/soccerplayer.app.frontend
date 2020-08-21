import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Title, Text, Button, Icon } from 'components/Base';
import { Error } from 'ui';
import cn from 'classnames';
import * as styles from './wallet-balances.styl';
import {
  formatWithTwoDecimals,
  formatWithSixDecimals,
  ones,
  truncateAddressString,
} from 'utils';
import { useStores } from '../../stores';
import { AuthWarning } from '../../components/AuthWarning';
import { Routes } from '../../constants';

const AssetRow = observer<any>(props => {
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
      </Box>
    </Box>
  );
});

export const WalletBalances = observer(() => {
  const { user, userMetamask, actionModals } = useStores();

  return (
    <Box
      direction="column"
      className={styles.walletBalances}
      margin={{ vertical: 'large' }}
    >
      {/*<Title>Wallet Info</Title>*/}

      <Box className={styles.container}>
        <Box direction="column" margin={{ bottom: 'large' }}>
          <Box direction="row" justify="between">
            <Box direction="row" align="baseline">
              <Title margin={{ right: 'xsmall' }}>Harmony</Title>
              <Text>(ONE Wallet)</Text>
            </Box>
            {user.isAuthorized && (
              <Box
                onClick={() => {
                  user.signOut();
                }}
                margin={{ left: 'medium' }}
              >
                <Icon
                  glyph="Logout"
                  size="24px"
                  style={{ opacity: 0.5 }}
                  color="BlackTxt"
                />
              </Box>
            )}
          </Box>

          {user.isAuthorized ? (
            <>
              <AssetRow
                asset="Harmony Address"
                value={truncateAddressString(user.address)}
              />

              <AssetRow
                asset="Harmony ONE"
                value={formatWithTwoDecimals(ones(user.balance))}
              />

              <AssetRow
                asset="Harmony BUSD"
                value={formatWithTwoDecimals(user.hmyBUSDBalance)}
              />
            </>
          ) : (
            <Box direction="row" align="baseline" justify="start">
              <Button
                margin={{ vertical: 'medium' }}
                onClick={() => {
                  if (!user.isOneWallet) {
                    actionModals.open(() => <AuthWarning />, {
                      title: '',
                      applyText: 'Got it',
                      closeText: '',
                      noValidation: true,
                      width: '500px',
                      showOther: true,
                      onApply: () => Promise.resolve(),
                    });
                  } else {
                    user.signIn();
                  }
                }}
              >
                Connect ONE Wallet
              </Button>
              {!user.isOneWallet ? (
                <Error error="ONE Wallet not found" />
              ) : null}
            </Box>
          )}
        </Box>

        <Box direction="column">
          <Box direction="row" align="baseline">
            <Title margin={{ right: 'xsmall' }}>Ethereum</Title>
            <Text>(Metamask)</Text>
          </Box>

          {userMetamask.isAuthorized ? (
            <>
              <AssetRow
                asset="ETH Address"
                value={truncateAddressString(userMetamask.ethAddress)}
              />

              <AssetRow
                asset="ETH"
                value={formatWithSixDecimals(userMetamask.ethBalance)}
              />

              <AssetRow
                asset="Ethereum BUSD"
                value={formatWithTwoDecimals(userMetamask.ethBUSDBalance)}
                last={true}
              />
            </>
          ) : (
            <Box direction="row" align="baseline" justify="start">
              <Button
                margin={{ vertical: 'medium' }}
                onClick={() => {
                  userMetamask.signIn();
                }}
              >
                Connect Metamask
              </Button>
              {userMetamask.error ? <Error error={userMetamask.error} /> : null}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
});
