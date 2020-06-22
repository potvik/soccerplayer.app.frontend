import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export function Tile({ basename, children }: any) {
  return (
    <LinkWrapper to={`/${basename}`}>
      <TileSquare>{children}</TileSquare>
    </LinkWrapper>
  );
}

const LinkWrapper = styled(Link)`
  text-decoration: none;
`;

const TileSquare = styled.div`
  width: 359px;
  height: 225px;
  margin-bottom: 30px;

  background: white;
  border-radius: 4px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.07);
`;
