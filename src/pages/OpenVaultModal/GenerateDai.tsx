import * as React from 'react';
import { Box } from 'grommet';
import { Text, Title } from 'components/Base';
import { Form, isRequired, MobxForm, NumberInput } from 'components/Form';
import { computed, observable } from 'mobx';
import { inject, observer } from 'mobx-react';
import { formatWithTwoDecimals, moreThanZero, ones } from 'utils';
import { IStores, useStores } from 'stores';
import { Feeds } from './Feeds';

@inject('user', 'actionModals', 'buyPlayer')
@observer
export class GenerateDai extends React.Component<IStores> {
  formRef: MobxForm;

  @observable formData = {
    amountOne: 0,
    amountDai: 0,
  };

  @computed
  get maxDai() {
    return this.formData.amountOne * 0.5
  }

  validateFields = async () => {
    this.formRef.validateFields().then(async data => {
      console.log(data);
    });
  };

  render() {
    const { user } = this.props;

    return (
      <Box direction="column" pad="xlarge">
        <Box direction="column" align="center">
          <Title bold={true}>Deposit GEM and Generate Dai</Title>
          <Box margin={{ vertical: 'medium' }}>
            <Text>
              Different collateral types have different risk parameters and
              collateralization ratios.
            </Text>
          </Box>
        </Box>
        <Box direction="row" margin={{ vertical: 'large' }}>
          <Form
            ref={ref => (this.formRef = ref)}
            data={this.formData}
            {...({} as any)}
          >
            <Box
              direction="column"
              justify="between"
              align="start"
              margin={{ vertical: '20px' }}
            >
              <Box direction="column" gap="10px">
                <Text bold={true}>
                  How much GEM would you like to lock in your Vault?
                </Text>
                <Text>
                  The amount of GEM you lock up determines how much Dai you can
                  generate.
                </Text>
                <Box direction="row" align="baseline">
                  <NumberInput
                    name="amountOne"
                    style={{ width: '260px', marginRight: 12 }}
                    placeholder="0 GEM"
                    rules={[isRequired, moreThanZero]}
                  />
                  <Text bold={true}>GEM</Text>
                </Box>
                <Text size="small" bold={true}>
                  YOUR BALANCE {formatWithTwoDecimals(ones(user.balance))} GEMs
                </Text>
              </Box>

              <Box direction="column" margin={{ top: 'xlarge' }} gap="10px">
                <Text bold={true}>
                  How much Dai would you like to generate?
                </Text>
                <Text>
                  Generate an amount that is safely above the liquidation ratio.
                </Text>
                <Box direction="row" align="baseline">
                  <NumberInput
                    name="amountDai"
                    style={{ width: '260px', marginRight: 12 }}
                    placeholder="0 DAI"
                    rules={[isRequired, moreThanZero]}
                  />
                  <Text bold={true}>DAI</Text>
                </Box>
                <Text bold={true} size="small">
                  MAX AVAIL TO GENERATE {formatWithTwoDecimals(this.maxDai)} DAI
                </Text>
              </Box>
            </Box>
          </Form>

          <Feeds />
        </Box>
      </Box>
    );
  }
}
