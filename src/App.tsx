import * as React from 'react';
import { baseTheme } from 'themes';
import { GlobalStyle } from './GlobalStyle';
import { Providers } from './Providers';
import { Redirect, Route, Switch } from 'react-router';
import { PlayersMarketplace } from './pages/PlayersMarketplace';

export const App: React.FC = () => (
  <Providers>
    <React.Suspense fallback={<div />}>
      <Switch>
        <Route exact path="/" component={PlayersMarketplace} />
        <Redirect to="/" />
      </Switch>
    </React.Suspense>
    <GlobalStyle theme={...baseTheme as any} />
  </Providers>
);
