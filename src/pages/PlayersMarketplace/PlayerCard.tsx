import * as React from 'react';
import { Box } from 'grommet';
import { Icon, Text } from 'components/Base';
import { observer } from 'mobx-react-lite';
import * as styles from './card.styl';

export interface IPlayerCardProps {
  id: string; // id from Blockchain
  player_img: string; // link to player image
  price: number; // init price
  transactions: number;
  owner: string;
}

const DataItem = (props: {
  text: any;
  label: string;
  icon: string;
  iconSize: string;
}) => {
  return (
    <Box direction="row" justify="between" gap="10px">
      <Box direction="row" justify="start" align="center" gap="5px">
        <Icon glyph={props.icon} size={props.iconSize} color="#1c2a5e" style={{ marginBottom: 2, width: 20 }}/>
        <Text color="#1c2a5e" size={'small'}>
          {props.label}
        </Text>
      </Box>
      <Text color="#1c2a5e" size={'small'} bold={true}>
        {props.text}
      </Text>
    </Box>
  );
};

export const PlayerCard = observer<IPlayerCardProps>(
  (props: IPlayerCardProps) => {
    return (
      <Box
        className={styles.cardContainer}
        height="100%"
        align="center"
        background=""
      >
        <img width="100%" src={"/players/test--.jpg"} />
        <Box className={styles.infoBlock} fill={true} gap="10px" pad="medium">
          <DataItem
            icon="Price"
            iconSize="16px"
            text={props.price + ' ONEs'}
            label="Price:"
          />
          <DataItem
            icon="User"
            iconSize="16px"
            text={props.owner}
            label="Owner:"
          />
          <DataItem
            icon="Refresh"
            iconSize="14px"
            text={props.transactions}
            label="Transactions:"
          />
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
