import * as React from 'react';
import { Box } from 'grommet';
import * as styles from './styles.styl';
import {
  Form,
  Input,
  isRequired,
  MobxForm,
  NumberInput,
} from 'components/Form';
import { inject, observer } from 'mobx-react';
import { IStores } from 'stores';
import { Button, Icon, Text } from 'components/Base';
import {
  formatWithTwoDecimals,
  moreThanZero,
  ones,
  truncateAddressString,
} from 'utils';
import { EXPLORER_URL } from '../../blockchain-bridge';
import { Spinner } from 'ui/Spinner';
import { EXCHANGE_STEPS } from '../../stores/Exchange';
import { Details } from './Details';

@inject('user', 'exchange')
@observer
export class Exchange extends React.Component<
  Pick<IStores, 'user'> & Pick<IStores, 'exchange'>
> {
  formRef: MobxForm;

  onClickHandler = (needValidate: boolean, callback: () => void) => {
    if (needValidate) {
      this.formRef.validateFields().then(() => {
        callback();
      });
    } else {
      callback();
    }
  };

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
          {exchange.step.id === EXCHANGE_STEPS.BASE ? (
            <Box direction="column" fill={true}>
              <Box
                direction="column"
                gap="2px"
                fill={true}
                margin={{ bottom: 'large' }}
              >
                <NumberInput
                  label="BUSD Amount"
                  name="amount"
                  type="decimal"
                  placeholder="0 ONE"
                  style={{ width: '100%' }}
                  rules={[isRequired, moreThanZero]}
                />
                <Text size="small" style={{ textAlign: 'right' }}>
                  <b>*Max Available</b> ={' '}
                  {formatWithTwoDecimals(ones(user.balance))} ONEs
                </Text>
              </Box>

              <Box direction="column" fill={true}>
                <Input
                  label="ETH Address"
                  name="to"
                  style={{ width: '100%' }}
                  placeholder="Your address"
                  rules={[isRequired]}
                />
              </Box>
            </Box>
          ) : null}
        </Form>

        {exchange.step.id === EXCHANGE_STEPS.CONFIRMATION ? <Details /> : null}

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
            <Box className={styles.description} margin={{ top: 'medium' }}>
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

        <Box
          direction="row"
          margin={{ top: 'large' }}
          justify="end"
          align="center"
        >
          {exchange.step.buttons.map(conf => (
            <Button
              bgColor="#00ADE8"
              style={{ width: conf.transparent ? 140 : 180 }}
              onClick={() => {
                this.onClickHandler(conf.validate, conf.onClick);
              }}
              transparent={!!conf.transparent}
            >
              {conf.title}
            </Button>
          ))}
        </Box>
      </Box>
    );
  }
}
