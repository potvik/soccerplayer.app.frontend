import * as React from 'react';
import { Box, BoxProps } from 'grommet';
import { Head } from 'components';
import { withTheme } from 'styled-components';
import { IStyledChildrenProps } from 'interfaces';

export const BaseContainer: React.FC<IStyledChildrenProps<
  BoxProps
>> = withTheme(
  ({ theme, children, ...props }: IStyledChildrenProps<BoxProps>) => {
    const { palette, container } = theme;
    const { minWidth, maxWidth } = container;
    return (
      <div
        style={{
          minHeight: '100%',
          backgroundColor: palette.Basic100,
        }}
      >
        <Head />
        <Box
          style={{
            minWidth,
            maxWidth,
            margin: '20px auto',
          }}
          {...props}
        >
          {children}
        </Box>
      </div>
    );
  },
);
