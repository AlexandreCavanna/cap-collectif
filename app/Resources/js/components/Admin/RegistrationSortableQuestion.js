// @flow
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { IntlMixin } from 'react-intl';
import { Button, ListGroupItem } from 'react-bootstrap';
import { SortableElement } from 'react-sortable-hoc';
import { updateRegistrationFieldModal, deleteRegistrationField } from '../../redux/modules/default';
import type { State, Dispatch } from '../../types';
import DragHandle from './DragHandle';

type Props = {
  isSuperAdmin: boolean,
  value: Object,
  deleteField: (id: number) => void,
  updateField: (id: number) => void
};

export const RegistrationQuestion = React.createClass({
  propTypes: {
    value: PropTypes.object.isRequired,
    isSuperAdmin: PropTypes.bool.isRequired,
    deleteField: PropTypes.func.isRequired,
    updateField: PropTypes.func.isRequired,
  },
  mixins: [IntlMixin],

  render() {
    const { value, isSuperAdmin, deleteField, updateField } = this.props;
    return (
      <ListGroupItem className="row" style={{ marginRight: 0, marginLeft: 0 }}>
        <div className="col-xs-1">
          <DragHandle />
        </div>
        <div className="col-xs-8">
          <strong>{value.question}</strong>
          <div>
            {this.getIntlMessage(`global.question.types.${value.type}`)}
          </div>
        </div>
        <div className="col-xs-3">
          <Button
            className="pull-right"
            disabled={!isSuperAdmin}
            onClick={!isSuperAdmin ? null : () => deleteField()}
          >
            Supprimer
          </Button>
          <Button
            disabled={!isSuperAdmin}
            style={{ marginRight: 5 }}
            className="pull-right"
            onClick={!isSuperAdmin ? null : () => updateField()}
          >
            Modifier
          </Button>
        </div>
      </ListGroupItem>
    );
  },
});

const mapStateToProps = (state: State) => ({
  isSuperAdmin: state.user.user && state.user.user.roles.includes('ROLE_SUPER_ADMIN'),
});
const mapDispatchToProps = (dispatch: Dispatch, props: Props) => ({
  updateField: () => { dispatch(updateRegistrationFieldModal(props.value.id)); },
  deleteField: () => { deleteRegistrationField(props.value.id, dispatch); },
});
const connector: Connector<{}, Props> = connect(mapStateToProps, mapDispatchToProps);
export default SortableElement(connector(RegistrationQuestion));
