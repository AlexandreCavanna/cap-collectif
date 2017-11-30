// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { createFragmentContainer, graphql } from 'react-relay';
import { Button, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import {
  isValid,
  isInvalid,
  isSubmitting,
  hasSubmitSucceeded,
  hasSubmitFailed
} from 'redux-form'
import type { GroupAdminUsers_group } from './__generated__/GroupAdminUsers_group.graphql';
import AlertAdminForm from '../../Alert/AlertAdminForm';
import GroupAdminUsersListGroupItem from './GroupAdminUsersListGroupItem'
import GroupAdminModalAddUsers from './GroupAdminModalAddUsers';

type Props = {
  group: GroupAdminUsers_group,
  valid: boolean,
  invalid: boolean,
  submitting: boolean,
  submitSucceeded: boolean,
  submitFailed: boolean,
  userIsDeleted: ?boolean,
  userIsNotDeleted: ?boolean,
};

type State = {
  showAddUsersModal: boolean
};

export const formName = 'group-admin-users';

export class GroupAdminUsers extends React.Component<Props, State> {
  state = {
    showAddUsersModal: false
  };

  getAlertAdminForm() {
    const {
      valid,
      invalid,
      submitting,
      submitSucceeded,
      submitFailed,
      userIsDeleted,
      userIsNotDeleted,
    } = this.props;

    if(userIsDeleted) {
      return (
        <AlertAdminForm
          valid
          invalid={false}
          submitSucceeded
          submitFailed={false}
          submitting={false}
        />
      )
    }

    if(userIsNotDeleted) {
      return (
        <AlertAdminForm
          valid={false}
          invalid={false}
          submitSucceeded={false}
          submitFailed
          submitting={false}
        />
      )
    }

    return (
      <AlertAdminForm
        valid={valid}
        invalid={invalid}
        submitSucceeded={submitSucceeded}
        submitFailed={submitFailed}
        submitting={submitting}
      />
    )
  }

  openCreateModal = () => {
    this.setState({ showAddUsersModal: true });
  };

  handleClose = () => {
    this.setState({ showAddUsersModal: false });
  };


  render() {
    const {
      group,
      submitSucceeded,
      submitFailed,
      userIsDeleted,
    } = this.props;

    const { showAddUsersModal } = this.state;

    console.log(submitSucceeded);
    console.warn(submitFailed);
    console.error(userIsDeleted);

    return (
      <div className="box box-primary container">
        <div className="box-header  pl-0">
          <h3 className="box-title">
            <FormattedMessage id="group.admin.users" />
          </h3>
          <a
            className="pull-right link"
            target="_blank"
            rel="noopener noreferrer"
            href="https://aide.cap-collectif.com/article/137-ajouter-des-groupes">
            <i className="fa fa-info-circle" /> Aide
          </a>
        </div>
        <div className="box-content">
          <Button
            bsStyle="success"
            href="#"
            onClick={() => this.openCreateModal()}>
            <i className="fa fa-plus-circle" /> <FormattedMessage id="group.admin.add_users" />
          </Button>
          {this.getAlertAdminForm()}
          <GroupAdminModalAddUsers
            show={showAddUsersModal}
            onClose={this.handleClose}
            group={group}
          />
          {group.usersConnection.edges ? (
            <ListGroup className="mt-15">
              {group.usersConnection.edges
                .map(edge => edge && edge.node)
                // https://stackoverflow.com/questions/44131502/filtering-an-array-of-maybe-nullable-types-in-flow-to-remove-null-values
                .filter(Boolean)
                .map((user) => (
                  <GroupAdminUsersListGroupItem key={user.id} user={user} groupId={group.id} />
                ))}
            </ListGroup>
          ) : (
            <div className="mb-15">
              <FormattedMessage id="group.admin.no_users" />
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    valid: isValid('group-users-add')(state),
    invalid: isInvalid('group-users-add')(state),
    submitting: isSubmitting('group-users-add')(state),
    submitSucceeded: hasSubmitSucceeded('group-users-add')(state),
    submitFailed: hasSubmitFailed('group-users-add')(state),
    userIsDeleted: state.user.groupAdminUsersUserDeletionSuccessful,
    userIsNotDeleted: state.user.groupAdminUsersUserDeletionFailed
  }
};

const container = connect(mapStateToProps)(GroupAdminUsers);

export default createFragmentContainer(
  container,
  graphql`
    fragment GroupAdminUsers_group on Group {
      id
      title
      usersConnection {
        edges {
          node {
            id
            ...GroupAdminUsersListGroupItem_user
          }
        }
      }
    }
  `,
);
