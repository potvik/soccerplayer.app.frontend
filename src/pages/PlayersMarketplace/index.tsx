import * as React from 'react';
import { Box } from 'grommet';
import { Title } from 'components/Base';
import { BaseContainer, PageContainer } from 'components';
import { PlayerCard } from './PlayerCard';
import { players } from './palyers_config';

export function PlayersMarketplace() {
  return (
    <BaseContainer>
      <PageContainer>
        <Title bold margin={{ vertical: '30px' }} size="large">
          All cards / Top 10 cards / My team
        </Title>

        <Box direction="row" justify="between" wrap>
          {players.map(player => (
            <PlayerCard key={player.id + player.player_img} {...player} />
          ))}
        </Box>
      </PageContainer>
    </BaseContainer>
  );
}
