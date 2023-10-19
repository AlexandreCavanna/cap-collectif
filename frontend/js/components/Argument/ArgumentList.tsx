import * as React from 'react'
import { Panel } from 'react-bootstrap'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import { QueryRenderer, createFragmentContainer, graphql } from 'react-relay'
import Input from '../Form/Input'
import environment, { graphqlError } from '../../createRelayEnvironment'
import type { ArgumentSelectOrder } from './ArgumentListView'
import ArgumentListView from './ArgumentListView'
import Loader from '../Ui/FeedbacksIndicators/Loader'
import type { ArgumentListQueryResponse, ArgumentListQueryVariables } from '~relay/ArgumentListQuery.graphql'
import type { ArgumentList_argumentable } from '~relay/ArgumentList_argumentable.graphql'
import type { ArgumentType, GlobalState } from '../../types'
type Props = {
  readonly argumentable: ArgumentList_argumentable
  readonly isAuthenticated: boolean
  readonly type: ArgumentType
}
type State = {
  readonly order: ArgumentSelectOrder
}
export class ArgumentList extends React.Component<Props, State> {
  state = {
    order: 'last',
  }
  updateOrderBy = (event: Event) => {
    this.setState({
      // @ts-expect-error
      order: event.target.value,
    })
  }

  render() {
    const { type, argumentable, isAuthenticated } = this.props
    const { order } = this.state
    return (
      <div id={`opinion__arguments--${type}`} className="block--tablet">
        <QueryRenderer
          environment={environment}
          query={graphql`
            query ArgumentListQuery(
              $argumentableId: ID!
              $isAuthenticated: Boolean!
              $type: ArgumentValue!
              $cursor: String
              $orderBy: ArgumentOrder!
            ) {
              argumentable: node(id: $argumentableId) {
                ... on Argumentable {
                  allArguments: arguments(first: 0, type: $type)
                    @connection(key: "ArgumentList_allArguments", filters: ["type"]) {
                    totalCount
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
                ...ArgumentListView_argumentable
                  @arguments(isAuthenticated: $isAuthenticated, type: $type, orderBy: $orderBy, cursor: $cursor)
              }
            }
          `}
          variables={
            {
              isAuthenticated,
              argumentableId: argumentable.id,
              type: type === 'SIMPLE' ? 'FOR' : type,
              orderBy: {
                field: 'PUBLISHED_AT',
                direction: 'DESC',
              },
            } as ArgumentListQueryVariables
          }
          render={({
            error,
            props,
          }: ReactRelayReadyState & {
            props: ArgumentListQueryResponse | null | undefined
          }) => {
            if (error) {
              return graphqlError
            }

            if (props) {
              if (!props.argumentable || !props.argumentable.allArguments) {
                return graphqlError
              }

              const { totalCount } = props.argumentable.allArguments
              const htmlFor = `filter-arguments-${type}`
              return (
                <Panel className="panel--white panel-custom">
                  <Panel.Heading>
                    <Panel.Title componentClass="h4" className="opinion__header__title d-flex">
                      {type === 'SIMPLE' ? (
                        <FormattedMessage
                          id="global.simple_arguments"
                          values={{
                            num: totalCount,
                          }}
                        />
                      ) : type === 'FOR' ? (
                        <FormattedMessage
                          id="count-arguments-for"
                          values={{
                            num: totalCount,
                          }}
                        />
                      ) : (
                        <FormattedMessage
                          id="argument.no.list"
                          values={{
                            num: totalCount,
                          }}
                        />
                      )}
                    </Panel.Title>
                    {totalCount > 1 ? (
                      <div className="panel-heading__actions">
                        <Input
                          id={htmlFor}
                          label={
                            <span className="sr-only">
                              <FormattedMessage id={`argument.filter.${type === 'AGAINST' ? 'no' : 'yes'}`} />
                            </span>
                          }
                          className="form-control pull-right"
                          type="select"
                          value={order}
                          onChange={this.updateOrderBy}
                        >
                          <FormattedMessage id="project.sort.last">
                            {(message: string) => <option value="last">{message}</option>}
                          </FormattedMessage>
                          <FormattedMessage id="opinion.sort.old">
                            {(message: string) => <option value="old">{message}</option>}
                          </FormattedMessage>
                          <FormattedMessage id="argument.sort.popularity">
                            {(message: string) => <option value="popular">{message}</option>}
                          </FormattedMessage>
                        </Input>
                      </div>
                    ) : null}
                  </Panel.Heading>
                  <ArgumentListView order={order} argumentable={props.argumentable} type={type} />
                </Panel>
              )
            }

            return <Loader />
          }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  isAuthenticated: !!state.user.user,
})

// @ts-ignore
const container = connect<any, any>(mapStateToProps)(ArgumentList)
export default createFragmentContainer(container, {
  argumentable: graphql`
    fragment ArgumentList_argumentable on Argumentable {
      id
    }
  `,
})
