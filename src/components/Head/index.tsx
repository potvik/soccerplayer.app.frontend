import * as React from 'react';
import styled, { withTheme } from 'styled-components';
import { BoxProps, Box } from 'grommet';
import { useHistory } from 'react-router';
import { observer } from 'mobx-react-lite';
import { Routes } from 'constants/routes';
import { Text } from 'grommet';
import { IStyledChildrenProps } from 'interfaces';
import { Title } from '../Base/components/Title';
import { Icon } from '../Base/components/Icons';
import { useStores } from '../../stores';

const MainLogo = styled.img`
  width: 62px;
  height: 62px;
`;

export const Head: React.FC<IStyledChildrenProps<BoxProps>> = withTheme(
  observer(({ theme }: IStyledChildrenProps<BoxProps>) => {
    const history = useHistory();
    const { user } = useStores();
    const { palette, container } = theme;
    const { minWidth, maxWidth } = container;
    return (
      <Box
        style={{
          background: palette.StandardWhite,
          overflow: 'visible',
          boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          direction="row"
          align="center"
          style={{
            minWidth,
            maxWidth,
            margin: '0 auto',
            padding: '0px 30px',
            height: 100,
            minHeight: 100,
            width: '100%',
          }}
        >
          <Box
            align="center"
            margin={{ right: 'small' }}
            style={{ flex: '1 0 auto' }}
          >
            <MainLogo src="main_logo.png" />
          </Box>
          <Box style={{ minWidth: 300, flex: '0 1 auto' }}>
            <Title size="small" color="BlackTxt" bold>
              Harmony Soccer Players
            </Title>
          </Box>
          <Box style={{ flex: '1 1 100%' }} />
          {user.isAuthorized ? (
            <Box
              direction="row"
              justify="end"
              align="center"
              style={{ flex: '1 0 auto' }}
            >
              <Box>
                {}
              </Box>
              <Box
                onClick={() => {
                  user.logoutEx().then(() => {
                    history.push(`/${Routes.login}`);
                  });
                }}
                margin={{ left: 'medium' }}
              >
                <Icon
                  glyph="Logout"
                  size="24px"
                  style={{ opacity: 0.5 }}
                  color="BlackTxt"
                />
              </Box>
            </Box>
          ) : (
            <Box
              direction="row"
              justify="end"
              align="center"
              style={{ flex: '1 0 auto' }}
            >
              <Box>
                <Text size="small" color="BlackTxt">
                  Sign in
                </Text>
              </Box>
              <Box
                onClick={() => {
                  user.logoutEx().then(() => {
                    history.push(`/${Routes.login}`);
                  });
                }}
                margin={{ left: 'medium' }}
              >
                <Icon
                  glyph="Logout"
                  size="24px"
                  style={{ opacity: 0.5 }}
                  color="BlackTxt"
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    );
  }),
);
