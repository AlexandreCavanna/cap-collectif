// @flow
import * as React from 'react';
import { Button, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import styled, { type StyledComponent } from 'styled-components';
import { createFragmentContainer, graphql } from 'react-relay';
import Toggle from '~/components/Ui/Toggle/Toggle';
import ListGroup from '../../Ui/List/ListGroup';
import type {
  Dispatch,
  FeatureToggle,
  FeatureToggles,
  SSOConfigurationInterface,
  State as GlobalState,
} from '~/types';
import { toggleFeature } from '../../../redux/modules/default';
import { toggleStatus } from '../../../mutations/ToggleSSOConfigurationStatusMutation';
import FranceConnectConfigurationModal from './FranceConnectConfigurationModal';
import type { ListPublicSSO_ssoConfigurations } from '~relay/ListPublicSSO_ssoConfigurations.graphql';
import type { FranceConnectConfigurationModal_ssoConfiguration$ref } from '~relay/FranceConnectConfigurationModal_ssoConfiguration.graphql';

type Props = {|
  ssoConfigurations: ListPublicSSO_ssoConfigurations,
  features: FeatureToggles,
  onToggle: (feature: FeatureToggle, value: boolean) => void,
|};

export type FranceConnectSSOConfiguration = {|
  ...SSOConfigurationInterface,
  +$fragmentRefs: FranceConnectConfigurationModal_ssoConfiguration$ref,
|};

type State = {|
  showFranceConnectModal: boolean,
|};

const ListGroupItemWithJustifyContentEnd: StyledComponent<{}, {}, typeof ListGroupItem> = styled(
  ListGroupItem,
)`
  && {
    justify-content: end;
  }

  .form-group {
    margin-bottom: 0;
    margin-top: 5px;
  }
`;

const ButtonWithMarginLeftAuto: StyledComponent<{}, {}, typeof Button> = styled(Button)`
  && {
    margin-left: auto;
  }
`;

export class ListPublicSSO extends React.Component<Props, State> {
  state = {
    showFranceConnectModal: false,
  };

  handleClose = () => {
    this.setState({ showFranceConnectModal: false });
  };

  render() {
    const { onToggle, features, ssoConfigurations } = this.props;
    const { showFranceConnectModal } = this.state;
    const franceConnect =
      ssoConfigurations.edges &&
      ssoConfigurations.edges
        .filter(Boolean)
        .map(edge => edge.node)
        .filter(Boolean)
        .find(node => node.__typename === 'FranceConnectSSOConfiguration');

    return (
      <>
        <ListGroup>
          {features.login_franceconnect && franceConnect && (
            <ListGroupItemWithJustifyContentEnd>
              <Toggle
                checked={franceConnect.enabled}
                onChange={() => {
                  toggleStatus(franceConnect);
                }}
              />
              <h5 className="mb-0 mt-0">
                <FormattedMessage id="capco.module.login_franceconnect" />
              </h5>
              <ButtonWithMarginLeftAuto
                bsStyle="warning"
                className="btn-outline-warning"
                onClick={() => {
                  this.setState((prevState: State) => ({
                    ...prevState,
                    showFranceConnectModal: !prevState.showFranceConnectModal,
                  }));
                }}>
                <i className="fa fa-pencil" /> <FormattedMessage id="global.edit" />
              </ButtonWithMarginLeftAuto>
              <FranceConnectConfigurationModal
                show={showFranceConnectModal}
                onClose={this.handleClose}
                ssoConfiguration={franceConnect}
              />
            </ListGroupItemWithJustifyContentEnd>
          )}
          <ListGroupItemWithJustifyContentEnd>
            <Toggle
              checked={features.login_facebook}
              onChange={() => onToggle('login_facebook', !features.login_facebook)}
            />
            <h5 className="mb-0 mt-0">Facebook</h5>
          </ListGroupItemWithJustifyContentEnd>
          <ListGroupItemWithJustifyContentEnd>
            <Toggle
              checked={features.login_gplus}
              onChange={() => onToggle('login_gplus', !features.login_gplus)}
            />
            <h5 className="mb-0 mt-0">Google</h5>
          </ListGroupItemWithJustifyContentEnd>
          <ListGroupItemWithJustifyContentEnd>
            <Toggle checked disabled />
            <h5 className="mb-0 mt-0">
              <FormattedMessage id="global.email" />
            </h5>
          </ListGroupItemWithJustifyContentEnd>
        </ListGroup>
      </>
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  features: state.default.features,
});
const mapDispatchToProps = (dispatch: Dispatch) => ({
  onToggle: (feature: FeatureToggle, value: boolean) => {
    toggleFeature(dispatch, feature, value);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  createFragmentContainer(ListPublicSSO, {
    ssoConfigurations: graphql`
      fragment ListPublicSSO_ssoConfigurations on InternalSSOConfigurationConnection {
        edges {
          node {
            ... on SSOConfiguration {
              __typename
              id
              enabled
              ...FranceConnectConfigurationModal_ssoConfiguration
            }
          }
        }
      }
    `,
  }),
);
