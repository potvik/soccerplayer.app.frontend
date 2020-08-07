import * as React from 'react';
import { Box } from 'grommet';
import { BaseContainer, PageContainer } from 'components';
import { observer } from 'mobx-react-lite';
import { WalletBalances } from './WalletBalances';
import { OpenVault } from './OpenVault';
import { Dashboard } from './Dashboard';

export const Overview = observer(() => {
  const hasVault = false;

  return (
    <BaseContainer>
      <PageContainer>
        <Box
          direction="row"
          align="start"
          justify="between"
          fill={true}
        >
          <Box direction="column" fill={true} justify="center">
            {!hasVault ? <OpenVault /> : <Dashboard />}
          </Box>

          <WalletBalances />
        </Box>
      </PageContainer>
    </BaseContainer>
  );
});