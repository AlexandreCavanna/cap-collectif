// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { createRefetchContainer, graphql, type RelayRefetchProp } from 'react-relay';
import type { ProposalListView_step } from '~relay/ProposalListView_step.graphql';
import type { ProposalListView_viewer } from '~relay/ProposalListView_viewer.graphql';
import Loader from '../../Ui/FeedbacksIndicators/Loader';
import type { GlobalState } from '../../../types';
import ProposalListViewPaginated from './ProposalListViewPaginated';
import { graphqlError } from '../../../createRelayEnvironment';
import type { ProposalViewMode } from '../../../redux/modules/proposal';
import type { MapOptions } from '../Map/Map.types';
import type { ProposalsState } from '~relay/ProposalListViewRefetchQuery.graphql';
import type { GeoJson } from '~/utils/geojson';
import CookieMonster from '~/CookieMonster';

type Filters = {|
  categories?: string,
  districts?: string,
  themes?: string,
  types?: string,
  statuses?: string,
  state?: ProposalsState | '0',
|};

export const queryVariables = (filters: Filters, order: ?string) => {
  let field = 'RANDOM';
  let direction = 'ASC';

  switch (order) {
    case 'least-votes':
      direction = 'ASC';
      field = 'VOTES';
      break;
    case 'votes':
      direction = 'DESC';
      field = 'VOTES';
      break;
    case 'points':
      direction = 'DESC';
      field = 'POINTS';
      break;
    case 'least-points':
      direction = 'ASC';
      field = 'POINTS';
      break;
    case 'old':
      direction = 'ASC';
      field = 'PUBLISHED_AT';
      break;
    case 'last':
      direction = 'DESC';
      field = 'PUBLISHED_AT';
      break;
    case 'comments':
      direction = 'ASC';
      field = 'COMMENTS';
      break;
    case 'cheap':
      direction = 'ASC';
      field = 'COST';
      break;
    case 'expensive':
      direction = 'DESC';
      field = 'COST';
      break;
    default:
      break;
  }

  return {
    orderBy: [{ field, direction }],
    district: filters.districts && filters.districts !== '0' ? filters.districts : null,
    theme: filters.themes && filters.themes !== '0' ? filters.themes : null,
    category: filters.categories && filters.categories !== '0' ? filters.categories : null,
    userType: filters.types && filters.types !== '0' ? filters.types : null,
    status: filters.statuses && filters.statuses !== '0' ? filters.statuses : null,
    token: CookieMonster.getAnonymousAuthenticatedWithConfirmedPhone(),
    state: filters.state && filters.state !== '0' ? filters.state : null,
  };
};

type Props = {
  filters: Filters,
  term: ?string,
  order: string,
  relay: RelayRefetchProp,
  step: ProposalListView_step,
  viewer: ?ProposalListView_viewer,
  defaultMapOptions: MapOptions,
  geoJsons: Array<GeoJson>,
  displayMap: boolean,
  displayMode: ProposalViewMode,
  count: number,
};
type State = {
  isRefetching: boolean,
  hasRefetchError: boolean,
};

export class ProposalListView extends React.Component<Props, State> {
  state = {
    isRefetching: false,
    hasRefetchError: false,
  };

  componentDidUpdate(prevProps: Props) {
    const { term, filters, order } = this.props;

    if (prevProps.order !== order || prevProps.filters !== filters || prevProps.term !== term) {
      this._refetch();
    }
  }

  _refetch = () => {
    this.setState({ isRefetching: true, hasRefetchError: false });
    const { filters, order, step, term, relay, viewer } = this.props;

    const refetchVariables = fragmentVariables => {
      return {
        ...queryVariables(filters, order),
        stepId: step.id,
        isAuthenticated: !!viewer,
        count: fragmentVariables.count,
        term: term || null,
      };
    };

    relay.refetch(
      refetchVariables,
      null,
      (error: ?Error) => {
        if (error) {
          this.setState({ hasRefetchError: true });
        }
        this.setState({ isRefetching: false });
      },
      { force: true },
    );

    this.setState({ isRefetching: false });
  };

  render() {
    const { displayMap, geoJsons, defaultMapOptions, step, viewer, displayMode, count } =
      this.props;
    const { hasRefetchError, isRefetching } = this.state;

    if (hasRefetchError) {
      return graphqlError;
    }

    if (isRefetching) {
      return <Loader />;
    }

    return (
      <ProposalListViewPaginated
        displayMap={displayMap}
        geoJsons={geoJsons}
        defaultMapOptions={defaultMapOptions}
        count={count}
        step={step}
        viewer={viewer}
        displayMode={displayMode}
      />
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  filters: state.proposal.filters || {},
  term: state.proposal.terms,
  order: state.proposal.order,
});

const container = connect<any, any, _, _, _, _>(mapStateToProps)(ProposalListView);

export default createRefetchContainer(
  container,
  {
    viewer: graphql`
      fragment ProposalListView_viewer on User @argumentDefinitions(stepId: { type: "ID!" }) {
        ...ProposalListViewPaginated_viewer @arguments(stepId: $stepId)
      }
    `,
    step: graphql`
      fragment ProposalListView_step on ProposalStep
      @argumentDefinitions(count: { type: "Int" }, token: { type: "String" }) {
        id
        ...ProposalListViewPaginated_step @arguments(token: $token)
      }
    `,
  },
  graphql`
    query ProposalListViewRefetchQuery(
      $stepId: ID!
      $cursor: String
      $orderBy: [ProposalOrder]
      $isAuthenticated: Boolean!
      $count: Int
      $term: String
      $district: ID
      $category: ID
      $status: ID
      $theme: ID
      $userType: ID
      $token: String
      $state: ProposalsState
    ) {
      step: node(id: $stepId) {
        id
        ...ProposalListView_step
        ...ProposalStepPageHeader_step
      }
    }
  `,
);
