import React from 'react';
import { Box } from 'grommet';
import { Title, Text, Icon, TextInput } from 'components/Base';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { PlayerCardLite } from './PlayerCardLite';
import * as styles from './card.styl';
import { EXPLORER_URL } from '../../blockchain';
import { Spinner } from 'ui';
import { truncateAddressString } from '../../utils';

interface IBuyPlayerModalProps {}

export const SendPlayerModal = observer<IBuyPlayerModalProps>(props => {
  const { sendPlayer } = useStores();

  if (sendPlayer.status !== 'success') {
    return <Text>Loading...</Text>;
  }

  let icon = () => <Icon style={{ width: 50 }} glyph="RightArrow" />;
  let description = 'Approval';

  switch (sendPlayer.actionStatus) {
    case 'init':
      icon = () => (
        <Icon
          style={{ height: '110px', width: 'auto' }}
          className={styles.sendArrow}
          glyph="SendArrow"
        />
      );
      description = `Send your card to address`;
      break;

    case 'fetching':
      icon = () => <Spinner />;
      description = `Sending to ${sendPlayer.receiver}`;
      break;

    case 'error':
      icon = () => <Icon size="50" style={{ width: 50 }} glyph="Alert" />;
      description = sendPlayer.error;
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
      <Title style={{ textAlign: 'center' }}>Send Player Card</Title>
      <Box
        margin={{ top: 'large' }}
        direction="row"
        align="center"
        justify="between"
      >
        <PlayerCardLite player={sendPlayer.currentPlayer} />

        <Box
          direction="column"
          align="center"
          justify="center"
          style={{ maxWidth: 340, marginTop: -20 }}
        >
          {icon()}
          <Box className={styles.description}>
            <Text>{description}</Text>
            {sendPlayer.txId ? (
              <a
                style={{ marginTop: 10 }}
                href={EXPLORER_URL + `/tx/${sendPlayer.txId}`}
                target="_blank"
              >
                Tx id: {truncateAddressString(sendPlayer.txId)}
              </a>
            ) : null}
          </Box>
        </Box>

        {/*<PlayerCardLiteOwner player={sendPlayer.currentPlayer} />*/}
        <Box direction="column" gap="15px" align="center">
          <Text>Receiver address:</Text>
          <div className={styles.receiverBlock}>
            <TextInput
              disabled={sendPlayer.actionStatus === 'fetching'}
              value={sendPlayer.receiver}
              onChange={value => (sendPlayer.receiver = value)}
            />
          </div>
        </Box>
      </Box>
    </Box>
  );
});
