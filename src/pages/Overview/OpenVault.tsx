import * as React from 'react';
import { Box } from 'grommet';
import { observer } from 'mobx-react-lite';
import { Title, Button } from 'components/Base';
import * as styles from './open-vault.styl';
import { useCallback } from 'react';
import { AuthWarning } from '../../components/AuthWarning';
import { useStores } from 'stores';
import { GenerateDai } from '../OpenVaultModal/GenerateDai';

export const OpenVault = observer(() => {
  const { user, actionModals, openVault } = useStores();

  const openVaultHandler = useCallback(async () => {
    if (!user.isAuthorized) {
      if (!user.isOneWallet) {
        return actionModals.open(() => <AuthWarning />, {
          title: '',
          applyText: 'Got it',
          closeText: '',
          noValidation: true,
          width: '500px',
          showOther: true,
          onApply: () => {
            return Promise.resolve();
          },
        });
      } else {
        await user.signIn();
      }
    }

    actionModals.open(GenerateDai, {
      title: '',
      applyText: 'Open Vault',
      closeText: 'Cancel',
      noValidation: true,
      width: '1000px',
      showOther: true,
      onApply: () => {
        openVault.hasVault = true;

        return openVault.open(160, 1);
      },
      onClose: () => openVault.clear(),
    });
  }, []);

  return (
    <Box direction="column" align="center" className={styles.openVault}>
      <Title bold={true}>Open your first Vault to start generating Dai.</Title>

      <Button
        style={{ width: '180px' }}
        margin={{ top: 'medium' }}
        onClick={() => {
          openVaultHandler();
        }}
      >
        Get Started
      </Button>
    </Box>
  );
});
