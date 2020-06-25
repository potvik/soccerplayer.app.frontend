import * as React from 'react';
import { Box } from 'grommet';
import { Loader, Title } from 'components/Base';
import { BaseContainer, PageContainer } from 'components';
import { PlayerCard } from './PlayerCard';
import { useStores } from 'stores';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export const PlayersMarketplace = observer(() => {
  const { soccerPlayers } = useStores();

  useEffect(() => {
    soccerPlayers.getList();
  }, []);

  return (
    <BaseContainer>
      <PageContainer>
        <Title
          bold
          margin={{ vertical: '30px' }}
          size="large"
          color="white"
          style={{
            boxShadow: 'box-shadow: 0 0 20px rgba(0,0,0,0.4)',
          }}
        >
          All cards / Top 10 cards / My team
        </Title>

        {soccerPlayers.status === 'first_fetching' ? (
          <Loader />
        ) : (
          <Box direction="row" justify="between" wrap>
            {soccerPlayers.list.map((item, idx) => (
              <PlayerCard
                key={idx}
                player={item.player}
                emptyPlayer={item.emptyPlayer}
              />
            ))}
          </Box>
        )}
      </PageContainer>
    </BaseContainer>
  );
});
