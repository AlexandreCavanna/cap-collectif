import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import type { RelayFragmentContainer } from 'react-relay'
import { graphql, createFragmentContainer } from 'react-relay' // TODO https://github.com/cap-collectif/platform/issues/7774

// eslint-disable-next-line no-restricted-imports
import { ListGroup } from 'react-bootstrap'
import type { ContactAdminList_query } from '~relay/ContactAdminList_query.graphql'
import ContactAdminListItem from './ContactAdminListItem'
import ContactFormAdminAdd from './ContactFormAdminAdd'
type Props = {
  readonly query: ContactAdminList_query
}

class ContactAdminList extends React.Component<Props> {
  renderContactsList(): JSX.Element | JSX.Element[] | string {
    const { query } = this.props

    if (query.contactForms && query.contactForms.length > 0) {
      const contactForms = query.contactForms.filter(Boolean)
      return (
        <ListGroup>
          {contactForms.filter(Boolean).map(contactForm => (
            <ContactAdminListItem key={contactForm.id} contactForm={contactForm} />
          ))}
        </ListGroup>
      )
    }

    return <FormattedMessage id="admin.fields.step.no_proposal_form" />
  }

  render(): JSX.Element | JSX.Element[] | string {
    return (
      <div className="form-group">
        <h4>
          <strong>
            <FormattedMessage id="proposal_form_list" />
            <br />
            <span className="excerpt small">
              <FormattedMessage id="forms-list-helptext" />
            </span>
          </strong>
        </h4>
        {this.renderContactsList()}
        <ContactFormAdminAdd />
      </div>
    )
  }
}

export default createFragmentContainer(ContactAdminList, {
  query: graphql`
    fragment ContactAdminList_query on Query {
      contactForms {
        id
        ...ContactAdminListItem_contactForm
      }
    }
  `,
}) as RelayFragmentContainer<typeof ContactAdminList>
