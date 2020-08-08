import * as React from 'react';
import { Box } from 'grommet';
import { BaseContainer, PageContainer } from 'components';
import { observer } from 'mobx-react-lite';
import { WalletBalances } from './WalletBalances';
import { OpenVault } from './OpenVault';
import { Dashboard } from './Dashboard';
import { useStores } from 'stores';
import { DisableWrap } from '../../components/Base/components/DisableWrap';
import { Loader } from '../../components/Base/components/Loader';

export const Overview = observer(() => {
  const { openVault, user } = useStores();
  const hasVault = openVault.hasVault;

  if (!user.vatInit && user.isAuthorized) {
    return (
      <BaseContainer>
        <PageContainer>
          <Loader />
        </PageContainer>
      </BaseContainer>
    );
  }

  return (
    <BaseContainer>
      <PageContainer>
        <Box direction="row" align="start" justify="between" fill={true}>
          <Box direction="column" fill={true} justify="center" wrap>
            {hasVault ? (
              <DisableWrap disabled={false}>
                <Dashboard />
              </DisableWrap>
            ) : null}
          </Box>

          <Box
            margin={{ left: 'large', top: '60px' }}
            style={{ minWidth: 300 }}
          >
            <DisableWrap disabled={!user.isAuthorized}>
              <WalletBalances />
            </DisableWrap>
          </Box>
        </Box>
        {!hasVault && <OpenVault />}
      </PageContainer>
    </BaseContainer>
  );
});
