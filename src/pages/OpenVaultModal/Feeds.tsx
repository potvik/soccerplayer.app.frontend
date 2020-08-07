import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Text } from 'components/Base';
import cn from 'classnames';
import * as styles from './feeds.styl';

const AssetRow = props => {
  return (
    <Box
      className={cn(
        styles.walletBalancesRow,
        props.last ? '' : '',
      )}
    >
      <Box margin={{ bottom: '2px' }}>
        <Text bold={true}>{props.label}</Text>
      </Box>
      <Text>{props.value}</Text>
    </Box>
  );
};

export const Feeds = observer(() => {
  return (
    <Box direction="column" className={styles.walletBalances}>
      <Box className={styles.container}>
        <AssetRow label="Your Collateralization Ratio" value={1000 + '%'} />
        <AssetRow label="Your Liquidation Price" value={333 + '$'} />
        <AssetRow label="Current ETH Price" value={333 + '$'} />
        <AssetRow label="Stability Fee" value={333 + '%'} />
        <AssetRow
          label="Max Dai available to Generate"
          value={333 + 'Dai'}
          last={true}
        />
      </Box>
    </Box>
  );
});
