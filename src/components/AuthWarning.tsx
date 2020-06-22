import React from 'react';
import { Box } from 'grommet';
import { Title } from './Base/components/Title';

export const AuthWarning = () => (
  <Box pad={{ horizontal: 'large', top: 'large' }}>
    <Title>Use Math Wallet Browser Extension</Title>
    <div>
      <p>
        Looks like you don't have the Math Wallet browser extension installed
        yet. Head over to the{' '}
        <a
          href="https://chrome.google.com/webstore/detail/math-wallet/afbcbjpbpfadlkmhmclhkeeodmamcflc"
          target="_blank"
          rel="noopener norefferer"
        >
          Math Wallet Chrome Extension
        </a>{' '}
        to quickly install the extension.
      </p>
    </div>
  </Box>
);
