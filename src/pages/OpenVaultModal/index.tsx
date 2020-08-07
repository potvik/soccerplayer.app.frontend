import React from 'react';
import { Box } from 'grommet';
import { Title, Text, Icon } from 'components/Base';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import * as styles from './card.styl';
import { EXPLORER_URL } from '../../blockchain';
import { Spinner } from 'ui';
import { truncateAddressString } from '../../utils';

interface IBuyPlayerModalProps {}

export const OpenVaultModal = observer<IBuyPlayerModalProps>(props => {
  const { buyPlayer, user } = useStores();

  if (buyPlayer.status !== 'success') {
    return <Text>Loading...</Text>;
  }

  let icon = () => <Icon style={{ width: 50 }} glyph="RightArrow" />;
  let description = 'Approval';

  switch (buyPlayer.actionStatus) {
    case 'init':
      icon = () => (
        <Icon
          style={{ height: '110px', width: 'auto' }}
          className={styles.sendArrow}
          glyph="SendArrow"
        />
      );
      description =
        'Receive 13% reward if someone buys your player smart contract and 2% is allocated in the mint account for service and maintenance';
      break;

    case 'fetching':
      icon = () => <Spinner />;
      description = 'Sending';
      break;

    case 'error':
      icon = () => <Icon size="50" style={{ width: 50 }} glyph="Alert" />;
      description = buyPlayer.error;
      break;

    case 'success':
      icon = () => <Icon size="50" style={{ width: 50 }} glyph="CheckMark" />;
      description = 'Success';
      break;
  }

  return (
    <Box
      pad={{ horizontal: 'large', top: 'large' }}
      className={styles.modalContainer}
    >
      <Title style={{ textAlign: 'center' }}>Buy Player Card</Title>
      <Box
        margin={{ top: 'large' }}
        direction="row"
        align="center"
        justify="between"
      >

        <Box
          direction="column"
          align="center"
          justify="center"
          style={{ maxWidth: 340, marginTop: -20 }}
        >
          {icon()}
          <Box className={styles.description}>
            <Text>{description}</Text>
            {buyPlayer.txId ? (
              <a
                style={{ marginTop: 10 }}
                href={EXPLORER_URL + `/tx/${buyPlayer.txId}`}
                target="_blank"
              >
                Tx id: {truncateAddressString(buyPlayer.txId)}
              </a>
            ) : null}
          </Box>
        </Box>

      </Box>
ё
    </Box>
  );
});
