import React from 'react';
import { Box } from 'grommet';
import { Title, Text } from 'components/Base';
import { observer } from 'mobx-react-lite';
import { useStores } from 'stores';
import { PlayerCardLite } from './PlayerCardLite';

interface IBuyPlayerModalProps {
  id: string;
}

export const BuyPlayerModal = observer<IBuyPlayerModalProps>(props => {
  const { buyPlayer, user } = useStores();

  if (buyPlayer.status !== 'success') {
    return <Text>Loading...</Text>;
  }

  return (
    <Box pad={{ horizontal: 'large', top: 'large' }}>
      <Title>Buy Player Card</Title>
      <Box
        margin={{ top: 'large' }}
        direction="row"
        align="center"
        justify="between"
      >
        <PlayerCardLite player={buyPlayer.currentPlayer} />
        <Box>{buyPlayer.actionStatus}</Box>
        <Box>{user.address}</Box>
      </Box>
    </Box>
  );
});
