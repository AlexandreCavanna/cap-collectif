// @ts-nocheck
import { graphql } from 'react-relay'
import { ConnectionHandler } from 'relay-runtime'
// eslint-disable-next-line import/no-unresolved
import type { RecordSourceSelectorProxy } from 'relay-runtime/store/RelayStoreTypes'
import environment from '../createRelayEnvironment'
import commitMutation from './commitMutation'
import type { DeleteSourceMutationVariables, DeleteSourceMutationResponse } from '~relay/DeleteSourceMutation.graphql'

const mutation = graphql`
  mutation DeleteSourceMutation($input: DeleteSourceInput!) {
    deleteSource(input: $input) {
      sourceable {
        id
      }
      deletedSourceId @deleteRecord
    }
  }
`

const commit = (
  variables: DeleteSourceMutationVariables,
  sourceIsPublished: boolean,
): Promise<DeleteSourceMutationResponse> =>
  commitMutation(environment, {
    mutation,
    variables,
    updater: (store: RecordSourceSelectorProxy) => {
      const payload = store.getRootField('deleteSource')

      if (!payload) {
        return
      }

      const sourceable = payload.getLinkedRecord('sourceable')

      if (!sourceable) {
        return
      }

      const id = sourceable.getValue('id')

      if (!id || typeof id !== 'string') {
        return
      }

      if (sourceIsPublished) {
        const allSourcesProxy = sourceable.getLinkedRecord('sources', {
          first: 0,
        })
        if (!allSourcesProxy) return
        const previousValue = parseInt(allSourcesProxy.getValue('totalCount'), 10)
        allSourcesProxy.setValue(previousValue - 1, 'totalCount')
      } else {
        const connection = ConnectionHandler.getConnection(sourceable, 'OpinionSourceBox_viewerSourcesUnpublished')

        if (!connection) {
          throw new Error('Expected "OpinionSourceBox_viewerSourcesUnpublished" to be in the store')
        }

        // @ts-expect-error argument 1 must be a int
        connection.setValue(connection.getValue('totalCount') - 1, 'totalCount')
      }
    },
  })

export default {
  commit,
}
