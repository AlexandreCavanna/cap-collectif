import * as React from 'react'
import { ListGroupItem } from 'react-bootstrap'
import { useIntl } from 'react-intl'
import { graphql, usePaginationFragment } from 'react-relay'
import { Heading, Modal, Button, CapUIModalSize } from '@cap-collectif/ui'
import UserInGroupModal from './UserInGroupModal'
import GroupAvatar from '../../User/GroupAvatar'
import ListGroupFlush from '../../Ui/List/ListGroupFlush'
import type { UserGroupModal_project$key } from '~relay/UserGroupModal_project.graphql'
import ResetCss from '~/utils/ResetCss'

type Props = {
  project: UserGroupModal_project$key
  show: boolean
  handleClose: () => void
}
const FRAGMENT = graphql`
  fragment UserGroupModal_project on Project
  @argumentDefinitions(count: { type: "Int", defaultValue: 10 }, cursor: { type: "String" })
  @refetchable(queryName: "RestrictedViewersListQuery") {
    id
    restrictedViewers(first: $count, after: $cursor) @connection(key: "UserGroupModal_restrictedViewers") {
      edges {
        node {
          id
          title
          ...UserInGroupModal_group @arguments(count: $count, cursor: $cursor)
        }
      }
      pageInfo {
        hasPreviousPage
        hasNextPage
        startCursor
        endCursor
      }
    }
  }
`

const UserGroupModal = ({ show, project, handleClose }: Props): JSX.Element => {
  const intl = useIntl()
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(FRAGMENT, project)
  const [currentShownGroupModalId, setCurrentShownGroupModalId] = React.useState(null)

  const loadMore = () => {
    loadNext(10)
  }

  return (
    <Modal
      show={show}
      onClose={handleClose}
      ariaLabel={intl.formatMessage({
        id: 'groups-with-access-to-project',
      })}
      size={CapUIModalSize.Lg}
      baseId="user-group-modal"
    >
      <ResetCss>
        <Modal.Header>
          <Heading>
            {intl.formatMessage({
              id: 'people-with-access-to-project',
            })}
          </Heading>
        </Modal.Header>
      </ResetCss>
      <Modal.Body>
        {data.restrictedViewers && data.restrictedViewers.edges && data.restrictedViewers.edges.length > 0 && (
          <ListGroupFlush className="d-flex text-left">
            {data.restrictedViewers.edges
              .filter(Boolean)
              .map(edge => edge && edge.node)
              .filter(Boolean)
              .map(group => (
                <ListGroupItem key={group.id} id={group.id}>
                  <GroupAvatar size={35} />
                  <Button
                    variant="link"
                    className="btn-md p-0"
                    onClick={() => {
                      setCurrentShownGroupModalId(group.id)
                    }}
                    title={intl.formatMessage(
                      {
                        id: 'persons-in-the-group',
                      },
                      {
                        groupName: group.title,
                      },
                    )}
                  >
                    {group.title}
                  </Button>
                  <UserInGroupModal
                    group={group}
                    show={currentShownGroupModalId === group.id}
                    handleClose={() => setCurrentShownGroupModalId(null)}
                  />
                </ListGroupItem>
              ))}
            {hasNext && (
              <div className="text-center">
                <Button variant="primary" onClick={loadMore} disabled={isLoadingNext}>
                  {intl.formatMessage({
                    id: isLoadingNext ? 'global.loading' : 'global.more',
                  })}
                </Button>
              </div>
            )}
          </ListGroupFlush>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" variantSize="medium" onClick={handleClose}>
          {intl.formatMessage({
            id: 'global.close',
          })}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default UserGroupModal
