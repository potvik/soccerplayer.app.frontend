import * as React from 'react';
import { Box } from 'grommet';
import { Title, Text, Button } from 'components/Base';
import { observer } from 'mobx-react-lite';
import * as styles from './styles.styl';
import cn from 'classnames';

export const Dashboard = observer(() => {
  return (
    <Box direction="row" justify="between" margin={{ top: "28px" }} wrap>
      <Box direction="column" className={styles.widget}>
        <Title>Liquidation price</Title>

        <Box className={styles.container}>
          <Box className={cn(styles.row, styles.first)}>
            <Text size="large" bold={true}>
              0.006 USDT
            </Text>
          </Box>

          <Box className={cn(styles.row, styles.underline)}>
            <Text>Current price information (ONE/USDT)</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>0.006 USDT</Text>
              </Box>
            </Box>
          </Box>

          <Box className={styles.row}>
            <Text>Liquidation penalty</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>13%</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box direction="column" className={styles.widget}>
        <Title>Collateralization ratio</Title>

        <Box className={styles.container}>
          <Box className={cn(styles.row, styles.first)}>
            <Text size="large" bold={true}>
              200.44%
            </Text>
          </Box>

          <Box className={cn(styles.row, styles.underline)}>
            <Text>Minimum ratio</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>150.00 %</Text>
              </Box>
            </Box>
          </Box>

          <Box className={styles.row}>
            <Text>Stability fee</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>0.00%</Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box direction="column" className={styles.widget}>
        <Title>ONE locked</Title>

        <Box className={styles.container}>
          <Box className={cn(styles.row, styles.underline)}>
            <Text>ONE locked</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>1000 ONE</Text>
                <Text className={styles.smallText}>10 USD</Text>
              </Box>
              <Button onClick={() => {}}>Deposit</Button>
            </Box>
          </Box>

          <Box className={styles.row}>
            <Text>Able to withdraw</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>1000 ONE</Text>
                <Text className={styles.smallText}>10 USD</Text>
              </Box>
              <Button onClick={() => {}}>Withdraw</Button>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box direction="column" className={styles.widget}>
        <Title>Outstanding Dai debt</Title>

        <Box className={styles.container}>
          <Box className={cn(styles.row, styles.underline)}>
            <Text>Outstanding Dai debt</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>20.00 DAI</Text>
              </Box>
              <Button onClick={() => {}}>Pay back</Button>
            </Box>
          </Box>

          <Box className={styles.row}>
            <Text>Available to generate</Text>

            <Box direction="row">
              <Box className={styles.priceColumn}>
                <Text>6.46 DAI</Text>
              </Box>
              <Button onClick={() => {}}>Generate</Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
