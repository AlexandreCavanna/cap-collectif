// @flow
import React, { useState } from 'react';
import { Button, ListGroupItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useIntl } from 'react-intl';
import styled, { type StyledComponent } from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import Toggle from '~/components/Ui/Toggle/Toggle';
import ListGroup from '../../Ui/List/ListGroup';
import type { Dispatch, FeatureToggle } from '~/types';
import { toggleFeature } from '~/redux/modules/default';
import { toggleStatus } from '~/mutations/ToggleSSOConfigurationStatusMutation';
import FranceConnectConfigurationModal from './FranceConnectConfigurationModal';
import type { ListPublicSSO_query$key } from '~relay/ListPublicSSO_query.graphql';
import AppBox from '~ui/Primitives/AppBox';
import FacebookConfigurationCard from '~/components/Admin/Authentification/FacebookConfigurationCard';
import type { FacebookConfigurationModal_ssoConfiguration$ref } from '~relay/FacebookConfigurationModal_ssoConfiguration.graphql';
import useFeatureFlag from '~/utils/hooks/useFeatureFlag';
import FranceConnectTeaserModal from '~/components/Admin/Authentification/FranceConnectTeaserModal';

type Props = {|
  query: ListPublicSSO_query$key,
  onToggle: (feature: FeatureToggle, value: boolean) => void,
|};

export type SSOConfiguration = {|
  +__typename: string,
  +id: string,
  +enabled: boolean,
  +clientId: ?string,
  +secret: ?string,
|};

export type FacebookSSOConfiguration = {|
  ...SSOConfiguration,
  +$fragmentRefs: FacebookConfigurationModal_ssoConfiguration$ref,
|};

const FRAGMENT_QUERY = graphql`
  fragment ListPublicSSO_query on Query {
    ssoConfigurations(first: 100) @connection(key: "ListPublicSSO_ssoConfigurations") {
      __id
      edges {
        node {
          id
          __typename
          enabled
          ...FranceConnectConfigurationModal_ssoConfiguration
          ...FacebookConfigurationCard_ssoConfiguration
        }
      }
    }
    viewer {
      isSuperAdmin
    }
  }
`;

const ListGroupItemWithJustifyContentStart: StyledComponent<{}, {}, typeof ListGroupItem> = styled(
  ListGroupItem,
)`
  && {
    justify-content: start;
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

export const ListPublicSSO = ({ query: queryFragment }: Props) => {
  const [showFranceConnectModal, setShowFranceConnectModal] = useState<boolean>(false);
  const isFranceConnectEnabled = useFeatureFlag('login_franceconnect');
  const query = useFragment(FRAGMENT_QUERY, queryFragment);
  const intl = useIntl();
  const handleClose = () => {
    setShowFranceConnectModal(false);
  };

  const { ssoConfigurations, viewer } = query;
  const ssoConfigurationConnectionId = ssoConfigurations.__id;

  const franceConnect =
    ssoConfigurations.edges &&
    ssoConfigurations.edges
      .filter(Boolean)
      .map(edge => edge.node)
      .filter(Boolean)
      .find(node => node.__typename === 'FranceConnectSSOConfiguration');

  const facebookConfig =
    ssoConfigurations.edges &&
    ssoConfigurations.edges
      .filter(Boolean)
      .map(edge => edge.node)
      .filter(Boolean)
      .find(node => node.__typename === 'FacebookSSOConfiguration');

  return (
    <>
      <ListGroup>
        <ListGroupItemWithJustifyContentStart>
          <Toggle
            id="toggle-franceConnect"
            checked={isFranceConnectEnabled && franceConnect?.enabled}
            onChange={() => toggleStatus(franceConnect)}
            label={
              <h5 className="mb-0 mt-0">
                {intl.formatMessage({ id: 'capco.module.login_franceconnect' })}
              </h5>
            }
          />

          {isFranceConnectEnabled && franceConnect?.enabled && viewer.isSuperAdmin && (
            <>
              <ButtonWithMarginLeftAuto
                bsStyle="warning"
                className="btn-outline-warning"
                onClick={() => {
                  setShowFranceConnectModal(!showFranceConnectModal);
                }}>
                <i className="fa fa-pencil" /> {intl.formatMessage({ id: 'global.edit' })}
              </ButtonWithMarginLeftAuto>
              <FranceConnectConfigurationModal
                show={showFranceConnectModal}
                onClose={handleClose}
                franceConnectConfiguration={franceConnect}
              />
            </>
          )}

          {!isFranceConnectEnabled && (
            <AppBox marginLeft="auto">
              <FranceConnectTeaserModal />
            </AppBox>
          )}
        </ListGroupItemWithJustifyContentStart>

        <ListGroupItemWithJustifyContentStart>
          <FacebookConfigurationCard
            ssoConfiguration={facebookConfig}
            ssoConfigurationConnectionId={ssoConfigurationConnectionId}
          />
        </ListGroupItemWithJustifyContentStart>

        <ListGroupItemWithJustifyContentStart>
          <Toggle
            id="toggle-email"
            checked
            disabled
            label={<h5 className="mb-0 mt-0">{intl.formatMessage({ id: 'global.email' })}</h5>}
          />
        </ListGroupItemWithJustifyContentStart>
      </ListGroup>
    </>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onToggle: (feature: FeatureToggle, value: boolean) => {
    toggleFeature(dispatch, feature, value);
  },
});

export default connect<any, any, _, _, _, _>(null, mapDispatchToProps)(ListPublicSSO);
