import * as React from 'react';
import { Box } from 'grommet';
import { BaseContainer, PageContainer } from 'components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import * as styles from './styles.styl';
import { Exchange } from '../Exchange';
import { EXCHANGE_MODE } from 'stores/Exchange';
import cn from 'classnames';
import { Text } from 'components/Base';

const LargeButton = (props: {
  title: string;
  onClick: () => void;
  description: string;
  isActive: boolean;
}) => {
  return (
    <Box
      direction="column"
      align="center"
      justify="center"
      className={cn(
        styles.largeButtonContainer,
        props.isActive ? styles.active : '',
      )}
      onClick={props.onClick}
      gap="5px"
    >
      <Text size="large" className={styles.title}>
        {props.title}
      </Text>
      <Text size="xsmall" color="#748695" className={styles.description}>
        {props.description}
      </Text>
    </Box>
  );
};

export const EthBridge = observer(() => {
  const { user, exchange } = useStores();

  return (
    <BaseContainer>
      <PageContainer>
        <Box
          direction="column"
          align="center"
          justify="center"
          fill={true}
          className={styles.base}
        >
          <Box
            direction="row"
            justify="between"
            width="560px"
            margin={{ vertical: 'large' }}
          >
            <LargeButton
              title="ETH -> ONE"
              description="(Metamask)"
              onClick={() => exchange.setMode(EXCHANGE_MODE.ETH_TO_ONE)}
              isActive={exchange.mode === EXCHANGE_MODE.ETH_TO_ONE}
            />
            <LargeButton
              title="ONE -> ETH"
              description="(ONE Wallet)"
              onClick={() => exchange.setMode(EXCHANGE_MODE.ONE_TO_ETH)}
              isActive={exchange.mode === EXCHANGE_MODE.ONE_TO_ETH}
            />
          </Box>

          <Exchange />

          {/*<Box*/}
          {/*  className={styles.walletBalancesContainer}*/}
          {/*>*/}
          {/*  <DisableWrap disabled={!user.isAuthorized}>*/}
          {/*    <WalletBalances />*/}
          {/*  </DisableWrap>*/}
          {/*</Box>*/}
        </Box>
      </PageContainer>
    </BaseContainer>
  );
});
