// @flow
import React from 'react';
import { connect } from 'react-redux';
import { QueryRenderer, graphql } from 'react-relay';
import environment, { graphqlError } from '../../../createRelayEnvironment';
import Loader from '../../Ui/FeedbacksIndicators/Loader';
import type { ProjectsListQueryResponse } from '~relay/ProjectsListQuery.graphql';
import { type GlobalState, type FeatureToggles } from '../../../types';
import ProjectListView from './ProjectListView';
import { getInitialValues } from './Filters/ProjectListFilters';
import ProjectsListPlaceholder from './ProjectsListPlaceholder';
import type { ProjectArchiveFilter } from '~relay/ProjectListViewRefetchQuery.graphql';

type Props = {|
  +authorId?: string,
  +onlyPublic: boolean,
  +orderBy: ?string,
  +term?: ?string,
  // Used only on /themes page
  +themeId: ?string,
  // Default props not working
  +orderBy?: ?string,
  // Defined pagination limit
  +limit: number,
  // Should we allow pagination ?
  +paginate: boolean,
  +isProjectsPage?: boolean,
  +features: FeatureToggles,
  +archived?: ProjectArchiveFilter | null,
|};

class ProjectsList extends React.Component<Props> {
  initialRenderVars = {};

  static defaultProps = {
    limit: 50,
    paginate: true,
    themeId: null,
    onlyPublic: false,
  };

  constructor(props: Props) {
    super(props);

    this.initialRenderVars = {
      ...getInitialValues(props),
      orderBy: props.orderBy,
      term: props.term,
      limit: props.limit,
      author: props.authorId,
      onlyPublic: props.onlyPublic,
    };
    if (props.themeId) {
      this.initialRenderVars.theme = props.themeId;
    }
  }

  renderProjectList = ({
    error,
    props,
  }: {
    ...ReactRelayReadyState,
    props: ?ProjectsListQueryResponse,
  }) => {
    const { limit, paginate, isProjectsPage, features } = this.props;
    if (error) {
      console.log(error); // eslint-disable-line no-console
      return graphqlError;
    }

    if (props) {
      return (
        <ProjectListView
          query={props}
          limit={limit}
          paginate={paginate}
          isProjectsPage={isProjectsPage}
        />
      );
    }
    return features.new_project_card ? <ProjectsListPlaceholder count={limit} /> : <Loader />;
  };

  render() {
    const { orderBy, type, theme, term, limit, status, author, onlyPublic, archived } =
      this.initialRenderVars;

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query ProjectsListQuery(
            $author: ID
            $count: Int
            $cursor: String
            $theme: ID
            $orderBy: ProjectOrder
            $type: ID
            $term: String
            $status: ID
            $onlyPublic: Boolean
            $archived: ProjectArchiveFilter
          ) {
            ...ProjectListView_query
              @arguments(
                theme: $theme
                orderBy: $orderBy
                cursor: $cursor
                author: $author
                type: $type
                term: $term
                status: $status
                count: $count
                onlyPublic: $onlyPublic
                archived: $archived
              )
          }
        `}
        variables={{
          type,
          term,
          theme,
          status,
          author,
          onlyPublic,
          count: limit,
          orderBy: {
            field: orderBy,
            direction: 'DESC',
          },
          archived,
        }}
        render={this.renderProjectList}
      />
    );
  }
}

const mapStateToProps = (state: GlobalState) => ({
  orderBy: state.project.orderBy || 'PUBLISHED_AT',
  features: state.default.features,
});

export default connect<any, any, _, _, _, _>(mapStateToProps)(ProjectsList);
