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
          All cards
        </Title>

        <Box direction="row" justify="between" wrap>
          {players.map(player => (
            <PlayerCard {...player} />
          ))}
        </Box>
      </PageContainer>
    </BaseContainer>
  );
}
