import React from 'react';
import { Box } from 'grommet';
import { Title, Text, Icon } from 'components/Base';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { PlayerCardLite } from './PlayerCardLite';
import * as styles from './card.styl';
import { EXPLORER_URL } from '../../blockchain';

interface IBuyPlayerModalProps {}

export const BuyPlayerModal = observer<IBuyPlayerModalProps>(props => {
  const { buyPlayer, user } = useStores();

  if (buyPlayer.status !== 'success') {
    return <Text>Loading...</Text>;
  }

  let icon = 'RightArrow';
  let description = 'Approval';

  switch (buyPlayer.actionStatus) {
    case 'init':
      icon = 'RightArrow';
      description = 'To';
      break;

    case 'fetching':
      icon = 'Refresh';
      description = 'Sending';
      break;

    case 'error':
      icon = 'Trash';
      description = 'Error';
      break;

    case 'success':
      icon = 'CheckMark';
      description = 'Success';
      break;
  }

  return (
    <Box
      pad={{ horizontal: 'large', top: 'large' }}
      className={styles.modalContainer}
    >
      <Title>Buy Player Card</Title>
      <Box
        margin={{ top: 'large' }}
        direction="row"
        align="center"
        justify="between"
      >
        <PlayerCardLite player={buyPlayer.currentPlayer} />

        <Box direction="row" align="end" justify="between" width="550px">
          <Box direction="column" align="center" gap="20px">
            <Icon style={{ width: 50 }} glyph={icon} />
            {description}
          </Box>

          <Box direction="column" gap="15px" align="center">
            <Text>Your address:</Text>
            <Box className={styles.addressBlock}>
              <a
                href={EXPLORER_URL + `/address/${user.address}`}
                target="_blank"
              >
                {user.address}
              </a>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
});
