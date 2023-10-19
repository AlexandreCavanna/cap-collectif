import * as React from 'react'
import { connect } from 'react-redux'
import { createFragmentContainer, graphql, QueryRenderer } from 'react-relay'
import environment, { graphqlError } from '../../createRelayEnvironment'
import UnpublishedArgumentList from './UnpublishedArgumentList'
import type { UnpublishedArgumentListRendererQueryResponse } from '~relay/UnpublishedArgumentListRendererQuery.graphql'
import type { UnpublishedArgumentListRenderer_argumentable } from '~relay/UnpublishedArgumentListRenderer_argumentable.graphql'
import type { ArgumentType, State } from '../../types'
type Props = {
  readonly argumentable: UnpublishedArgumentListRenderer_argumentable
  readonly isAuthenticated: boolean
  readonly type: ArgumentType
}
export class UnpublishedArgumentListRenderer extends React.Component<Props> {
  render() {
    const { type, isAuthenticated, argumentable } = this.props
    return (
      <div id={`opinion__unpublished--arguments--${type}`} className="block--tablet">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query UnpublishedArgumentListRendererQuery(
              $argumentableId: ID!
              $isAuthenticated: Boolean!
              $type: ArgumentValue!
            ) {
              argumentable: node(id: $argumentableId) {
                id
                ...UnpublishedArgumentList_argumentable
              }
            }
          `}
          variables={{
            isAuthenticated,
            argumentableId: argumentable.id,
            type: type === 'SIMPLE' ? 'FOR' : type,
          }}
          render={({
            props,
            error,
          }: ReactRelayReadyState & {
            props: UnpublishedArgumentListRendererQueryResponse | null | undefined
          }) => {
            if (error) {
              return graphqlError
            }

            if (props && props.argumentable) {
              return <UnpublishedArgumentList type={type} argumentable={props.argumentable} />
            }

            return null
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: State) => ({
  isAuthenticated: !!state.user.user,
})

// @ts-ignore
const container = connect<any, any>(mapStateToProps)(UnpublishedArgumentListRenderer)
export default createFragmentContainer(container, {
  argumentable: graphql`
    fragment UnpublishedArgumentListRenderer_argumentable on Argumentable {
      id
    }
  `,
})
