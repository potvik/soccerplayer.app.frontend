import * as React from 'react';
import { Box, Text } from 'grommet';
import { observer } from 'mobx-react-lite';
import * as styles from './card.styl';

export interface IPlayerCardProps {
  id: string; // id from Blockchain
  player_img: string; // link to player image
  price: number; // init price
  transactions: number;
  owner: string;
}

const DataItem = (props: { text: any; label: string }) => {
  return (
    <Box direction="row" justify="between">
      <Text color="#1c2a5e" size={'medium'}>
        {props.label}
      </Text>
      <Text color="#1c2a5e" size={'medium'}>
        {props.text}
      </Text>
    </Box>
  );
};

export const PlayerCard = observer<IPlayerCardProps>(
  (props: IPlayerCardProps) => {
    return (
      <Box className={styles.cardContainer} height="100%" align="center" background="">
        <img width="100%" src={props.player_img} />
        <Box className={styles.infoBlock} fill={true}  gap="20px" pad="medium">
          <DataItem text={props.price + ' ONEs'} label="Price" />
          <DataItem text={props.owner} label="Owner" />
          <DataItem text={props.transactions} label="Transactions" />
        </Box>
        <Box className={styles.buyButton} fill={true}>
          <Text color="white" size={'medium'}>
            Buy this contract
          </Text>
        </Box>
      </Box>
    );
  },
);
