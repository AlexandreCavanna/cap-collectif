import * as React from 'react'
import { QueryRenderer, graphql } from 'react-relay'
import environment, { graphqlError } from '../../createRelayEnvironment'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import CommentTrashedListPaginated, { TRASHED_COMMENT_PAGINATOR_COUNT } from '../Comment/CommentTrashedListPaginated'
import type { ProjectTrashCommentQueryResponse } from '~relay/ProjectTrashCommentQuery.graphql'
export type Props = {
  readonly projectId: string
  readonly isAuthenticated: boolean
}
export class ProjectTrashComment extends React.Component<Props> {
  render() {
    const { projectId, isAuthenticated } = this.props
    return (
      <div className="container">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ProjectTrashCommentQuery($projectId: ID!, $isAuthenticated: Boolean!, $cursor: String, $count: Int) {
              project: node(id: $projectId) {
                ...CommentTrashedListPaginated_project @arguments(count: $count, cursor: $cursor)
              }
            }
          `}
          variables={{
            projectId,
            isAuthenticated,
            count: TRASHED_COMMENT_PAGINATOR_COUNT,
            cursor: null,
          }}
          render={({
            error,
            props,
          }: ReactRelayReadyState & {
            props: ProjectTrashCommentQueryResponse | null | undefined
          }) => {
            if (error) {
              return graphqlError
            }

            if (!props) {
              return <Loader />
            }

            const { project } = props

            if (!project) {
              return graphqlError
            }

            return <CommentTrashedListPaginated project={project} />
          }}
        />
      </div>
    )
  }
}
export default ProjectTrashComment
