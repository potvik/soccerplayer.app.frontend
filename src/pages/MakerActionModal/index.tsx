import * as React from 'react';
import { Box } from 'grommet';
import { Icon, Text, Title } from 'components/Base';
import { Form, isRequired, MobxForm, NumberInput } from 'components/Form';
import { inject, observer } from 'mobx-react';
import {
  formatWithTwoDecimals,
  maxAmount,
  moreThanZero,
  truncateAddressString,
} from 'utils';
import { IStores } from 'stores';
// import { Feeds } from './Feeds';
import { Steps } from './Steps';
import * as styles from './card.styl';
import { Spinner } from 'ui/Spinner';
import { EXPLORER_URL } from '../../blockchain';

@inject('user', 'actionModals', 'openVault')
@observer
export class MakerActionModal extends React.Component<IStores> {
  formRef: MobxForm;

  componentDidMount = () => {
    // @ts-ignore
    this.props.onValidate.callback = () => {
      return this.formRef.validateFields();
    };
  };

  render() {
    const { user, openVault } = this.props;

    let icon = () => <Icon style={{ width: 50 }} glyph="RightArrow" />;
    let description = 'Approval';

    switch (openVault.actionStatus) {
      case 'fetching':
        icon = () => <Spinner />;
        description =
          '' +
          openVault.actionSteps[openVault.currentAction][
            openVault.currentActionStep
          ];
        break;

      case 'error':
        icon = () => <Icon size="50" style={{ width: 50 }} glyph="Alert" />;
        description = openVault.error;
        break;

      case 'success':
        icon = () => <Icon size="50" style={{ width: 50 }} glyph="CheckMark" />;
        description = 'Success';
        break;
    }

    const displayForm =
      openVault.actionStatus === 'init' || openVault.actionStatus === 'error';

    return (
      <Box direction="column" pad="xlarge">
        <Box direction="column" align="center">
          <Title bold={true}>
            {openVault.stepTitles[openVault.currentAction]}
          </Title>
        </Box>
        <Box direction="row" margin={{ top: 'medium' }}>
          <Form
            ref={ref => (this.formRef = ref)}
            data={this.props.openVault.formData}
            {...({} as any)}
          >
            <Box
              direction="column"
              justify="between"
              align="center"
              margin={{ vertical: '20px' }}
            >
              <Box
                direction="column"
                gap="10px"
                style={{
                  display: !displayForm ? 'none' : 'flex',
                }}
              >
                <Text bold={true}>{''}</Text>
                <Text>{''}</Text>
                <Box direction="row" align="baseline">
                  <NumberInput
                    name="amount"
                    style={{ width: '260px', marginRight: 12 }}
                    placeholder="0"
                    rules={[
                      isRequired,
                      moreThanZero,
                      maxAmount(openVault.maxAmount),
                    ]}
                    disabled={openVault.actionStatus === 'fetching'}
                  />
                </Box>
                <Text size="small">
                  Max amount <b>{formatWithTwoDecimals(openVault.maxAmount)}</b>
                </Text>
              </Box>

              {!displayForm ? <Steps /> : null}

              {openVault.actionStatus !== 'init' ? (
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
                    {openVault.txId ? (
                      <a
                        style={{ marginTop: 10 }}
                        href={EXPLORER_URL + `/tx/${openVault.txId}`}
                        target="_blank"
                      >
                        Tx id: {truncateAddressString(openVault.txId)}
                      </a>
                    ) : null}
                  </Box>
                </Box>
              ) : null}
            </Box>
          </Form>

          {/*<Feeds />*/}
        </Box>
      </Box>
    );
  }
}
