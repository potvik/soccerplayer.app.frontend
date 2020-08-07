import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Title, Text, Button } from 'components/Base';
import cn from 'classnames';
import * as styles from './wallet-balances.styl';

const AssetRow = props => {
  return (
    <Box className={cn(styles.walletBalancesRow, styles.underline)}>
      <Box>
        <Text bold={true}>{props.asset}</Text>
      </Box>

      <Box direction="row">
        <Box className={styles.priceColumn} margin={{ right: '10px' }}>
          <Text>{props.value}</Text>
        </Box>

        <Button style={{ width: '60px' }} transparent={true} onClick={() => {}}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export const WalletBalances = observer(() => {
  return (
    <Box direction="column" className={styles.walletBalances}>
      <Title>Wallet Balances</Title>

      <Box className={styles.container}>
        <AssetRow asset="ONE" value={1000} />
        <AssetRow asset="DAI" value={333} />
      </Box>
    </Box>
  );
});
