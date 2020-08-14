import * as React from 'react';
import { Box } from 'grommet';
import * as styles from './styles.styl';
import { Form, isRequired, MobxForm, NumberInput } from 'components/Form';
import { inject, observer } from 'mobx-react';
import { IStores } from 'stores';
import { Title, Text, Icon } from 'components/Base';
import {
  formatWithTwoDecimals,
  moreThanZero,
  ones,
  truncateAddressString,
} from 'utils';
import { EXPLORER_URL } from '../../blockchain-bridge';
import { Spinner } from 'ui/Spinner';

@inject('user', 'exchange')
@observer
export class Exchange extends React.Component<
  Pick<IStores, 'user'> & Pick<IStores, 'exchange'>
> {
  formRef: MobxForm;

  render() {
    const { user, exchange } = this.props;

    let icon = () => <Icon style={{ width: 50 }} glyph="RightArrow" />;
    let description = 'Approval';

    switch (exchange.actionStatus) {
      case 'fetching':
        icon = () => <Spinner />;
        description = 'Transaction is sending';
        break;

      case 'error':
        icon = () => <Icon size="50" style={{ width: 50 }} glyph="Alert" />;
        description = exchange.error;
        break;

      case 'success':
        icon = () => <Icon size="50" style={{ width: 50 }} glyph="CheckMark" />;
        description = 'Success';
        break;
    }

    return (
      <Box direction="column" pad="xlarge" className={styles.exchangeContainer}>
        <Form
          ref={ref => (this.formRef = ref)}
          data={this.props.exchange.transaction}
          {...({} as any)}
        >
          <Box direction="column" justify="between" align="start" fill={true}>
            <Box
              direction="column"
              gap="10px"
              style={{
                display: exchange.actionStatus === 'fetching' ? 'none' : 'flex',
              }}
              fill={true}
            >
              <NumberInput
                label="BUSD Amount"
                name="amount"
                type="decimal"
                placeholder="0 ONE"
                style={{ width: '100%' }}
                rules={[isRequired, moreThanZero]}
              />
              <Text size="small">
                YOUR BALANCE{' '}
                <b>{formatWithTwoDecimals(ones(user.balance))} ONEs</b>
              </Text>
            </Box>

            <Box
              direction="column"
              margin={{ top: 'xlarge' }}
              gap="10px"
              style={{
                display: exchange.actionStatus === 'fetching' ? 'none' : 'flex',
              }}
            >
              <Box direction="row" align="baseline">
                <NumberInput
                  label="ETH Address"
                  name="to"
                  style={{ width: '260px', marginRight: 12 }}
                  placeholder="Your address"
                  rules={[isRequired]}
                  disabled={exchange.actionStatus === 'fetching'}
                />
                <Text bold={true}>DAI</Text>
              </Box>
              {/*<Text size="small">*/}
              {/*  MAX AVAIL TO GENERATE <b>{formatWithTwoDecimals(this.maxDai)} DAI</b>*/}
              {/*</Text>*/}
            </Box>

            {exchange.actionStatus !== 'init' ? (
              <Box
                direction="column"
                align="center"
                justify="center"
                fill={true}
                pad={{ vertical: 'medium' }}
                margin={{ top: '30px' }}
                style={{ background: '#dedede40' }}
              >
                {icon()}
                <Box className={styles.description}>
                  <Text>{description}</Text>
                  {exchange.txHash ? (
                    <a
                      style={{ marginTop: 10 }}
                      href={EXPLORER_URL + `/tx/${exchange.txHash}`}
                      target="_blank"
                    >
                      Tx id: {truncateAddressString(exchange.txHash)}
                    </a>
                  ) : null}
                </Box>
              </Box>
            ) : null}
          </Box>
        </Form>
      </Box>
    );
  }
}
