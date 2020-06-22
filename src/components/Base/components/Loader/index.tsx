import * as React from 'react';
import { Layer, Box, Text } from 'grommet';

export const Loader: React.FC = () => (
  <Layer position="center">
    <Box pad="small" gap="small">
      <Text>Загрузка...</Text>
    </Box>
  </Layer>
);
Loader.displayName = 'Loader';