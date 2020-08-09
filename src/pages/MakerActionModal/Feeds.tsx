import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Text } from 'components/Base';
import cn from 'classnames';
import * as styles from './feeds.styl';
import { useStores } from 'stores';
import { formatWithSixDecimals, formatWithTwoDecimals } from 'utils';

const AssetRow = props => {
  return (
    <Box className={cn(styles.walletBalancesRow, props.last ? '' : '')}>
      <Box margin={{ bottom: '2px' }}>
        <Text bold={true}>{props.label}</Text>
      </Box>
      <Box direction="row">
        <Text>{props.value}</Text>
        {props.after && (
          <Text style={{ marginLeft: 5 }} color="Basic500">
            {props.after}
          </Text>
        )}
      </Box>
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
          value={
            formatWithTwoDecimals(openVault.feeds.сollateralizationRatio) + '%'
          }
          after="(min: 150%)"
        />
        <AssetRow
          label="Your Liquidation Price"
          value={
            formatWithSixDecimals(openVault.feeds.liquidationPrice) + ' USDT'
          }
        />
        <AssetRow
          label="Current ONE Price"
          value={formatWithSixDecimals(openVault.feeds.currentPrice) + ' USDT'}
        />
        <AssetRow
          label="Stability Fee"
          value={openVault.feeds.stabilityFee + '%'}
        />
        <AssetRow
          label="Max Dai available to Generate"
          value={
            formatWithTwoDecimals(openVault.feeds.maxDaiAvailable) + ' Dai'
          }
        />

        <Box
          direction="column"
          pad={{ top: 'small' }}
          margin={{ top: 'small' }}
          style={{ borderTop: '1px solid #dedede' }}
        >
          <AssetRow
            label="ONE amount (will be locked)"
            value={formatWithTwoDecimals(openVault.formData.amount)}
          />

          <AssetRow
            label="DAI amount (will be generate)"
            value={formatWithTwoDecimals(openVault.formData.amountDai)}
          />
        </Box>
      </Box>
    </Box>
  );
});
