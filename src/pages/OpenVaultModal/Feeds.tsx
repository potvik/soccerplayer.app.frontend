import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Text } from 'components/Base';
import cn from 'classnames';
import * as styles from './feeds.styl';
import { useStores } from '../../stores';

const AssetRow = props => {
  return (
    <Box className={cn(styles.walletBalancesRow, props.last ? '' : '')}>
      <Box margin={{ bottom: '2px' }}>
        <Text bold={true}>{props.label}</Text>
      </Box>
      <Text>{props.value}</Text>
    </Box>
  );
};

export const Feeds = observer(() => {
  const { openVault } = useStores();

  return (
    <Box direction="column" className={styles.walletBalances}>
      <Box className={styles.container}>
        <AssetRow
          label="Your Collateralization Ratio"
          value={openVault.feeds.сollateralizationRatio + '%'}
        />
        <AssetRow
          label="Your Liquidation Price"
          value={'$' + openVault.feeds.liquidationPrice}
        />
        <AssetRow
          label="Current ONE Price"
          value={'$' + openVault.feeds.currentPrice}
        />
        <AssetRow
          label="Stability Fee"
          value={openVault.feeds.stabilityFee + '%'}
        />
        <AssetRow
          label="Max Dai available to Generate"
          value={openVault.feeds.maxDaiAvailable + ' Dai'}
        />
      </Box>
    </Box>
  );
});
