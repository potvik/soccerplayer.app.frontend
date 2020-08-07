import * as React from 'react';
import { baseTheme } from 'themes';
import { GlobalStyle } from './GlobalStyle';
import { Providers } from './Providers';
import { Redirect, Route, Switch } from 'react-router';
import { ActionModals } from './components/ActionModals';
import { Overview } from './pages/Overview';

export const App: React.FC = () => (
  <Providers>
    <React.Suspense fallback={<div />}>
      <Switch>
        <Route exact path="/" component={Overview} />
        <Redirect to="/" />
      </Switch>
    </React.Suspense>
    <ActionModals />
    <GlobalStyle theme={...baseTheme as any} />
  </Providers>
);
