import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Text } from 'components/Base';
import { useStores } from 'stores';
import { formatWithSixDecimals, formatWithTwoDecimals } from 'utils';

const AssetRow = props => {
  return (
    <Box direction="row" justify="between" margin={{ bottom: 'medium' }}>
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

export const Details = observer(() => {
  const { openVault } = useStores();

  return (
    <Box direction="column">
      <AssetRow
        label="ETH address"
        value={
          formatWithTwoDecimals(openVault.feeds.сollateralizationRatio) + '%'
        }
      />
      <AssetRow
        label="BUSD amount"
        value={
          formatWithSixDecimals(openVault.feeds.liquidationPrice) + ' USDT'
        }
      />
      <AssetRow
        label="ONE address"
        value={formatWithSixDecimals(openVault.feeds.currentPrice) + ' USDT'}
      />

      <Box
        direction="column"
        pad={{ top: 'small' }}
        margin={{ top: 'small' }}
        style={{ borderTop: '1px solid #dedede' }}
      >
        <AssetRow
          label="Network Fee"
          value={formatWithTwoDecimals(openVault.formData.amount)}
        />

        <AssetRow
          label="Total"
          value={formatWithTwoDecimals(openVault.formData.amountDai)}
        />
      </Box>
    </Box>
  );
});
