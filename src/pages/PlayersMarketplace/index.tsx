import * as React from 'react';
import { Box } from 'grommet';
import { Button, DisableWrap, Loader, Select, Title } from 'components/Base';
import { BaseContainer, PageContainer } from 'components';
import { PlayerCard } from './PlayerCard';
import { useStores } from 'stores';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { PLAYERS_FILTER } from '../../stores/SoccerPlayersList';

export const PlayersMarketplace = observer(() => {
  const { soccerPlayers, user } = useStores();

  useEffect(() => {
    soccerPlayers.getList();
  }, []);

  return (
    <BaseContainer>
      <PageContainer>
        <Box
          direction="row"
          justify="between"
          align="center"
          margin={{ vertical: '30px' }}
        >
          {/*<Title*/}
          {/*  bold*/}
          {/*  size="large"*/}
          {/*  color="white"*/}
          {/*  style={{*/}
          {/*    boxShadow: 'box-shadow: 0 0 20px rgba(0,0,0,0.4)',*/}
          {/*  }}*/}
          {/*>*/}
          {/*  Collect your team*/}
          {/*</Title>*/}
          <Box direction="row" gap="20px" justify="center">
            <Button onClick={() => soccerPlayers.setFilter(PLAYERS_FILTER.ALL)}>
              All cards
            </Button>
            <Button onClick={() => soccerPlayers.setFilter(PLAYERS_FILTER.TOP)}>
              TOP 5 cards
            </Button>
            <Button
              disabled={!user.isAuthorized}
              onClick={() => soccerPlayers.setFilter(PLAYERS_FILTER.MY)}
            >
              My cards
            </Button>
          </Box>

          <Box gap="20px" direction="row" align="end">
            <Title
              size="small"
              color="white"
              style={{
                boxShadow: 'box-shadow: 0 0 20px rgba(0,0,0,0.4)',
              }}
            >
              sort by
            </Title>
            <Select
              size="medium"
              onChange={soccerPlayers.setSort}
              value={soccerPlayers.sort}
              options={[
                {
                  text: 'price',
                  value: 'sellingPrice',
                },
                {
                  text: 'card number',
                  value: 'internalPlayerId',
                },
              ]}
            />
          </Box>
        </Box>

        {soccerPlayers.status === 'first_fetching' ? (
          <Loader />
        ) : (
          <Box
            direction="row"
            justify={
              soccerPlayers.filteredList.length < 10 ? 'center' : 'between'
            }
            align="center"
            wrap
            gap="10px"
            style={{ minHeight: 600 }}
          >
            {soccerPlayers.filteredList.map(item => (
              <PlayerCard
                key={item.player.internalPlayerId}
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
