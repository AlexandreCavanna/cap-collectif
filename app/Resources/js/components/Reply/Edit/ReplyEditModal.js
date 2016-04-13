import React from 'react';
import { IntlMixin } from 'react-intl';
import SubmitButton from '../../Form/SubmitButton';
import CloseButton from '../../Form/CloseButton';
import ReplyForm from '../Form/ReplyForm';
import { Modal } from 'react-bootstrap';

const ReplyEditModal = React.createClass({
  propTypes: {
    form: React.PropTypes.object.isRequired,
    reply: React.PropTypes.object.isRequired,
    show: React.PropTypes.bool.isRequired,
    onToggleModal: React.PropTypes.func.isRequired,
    onEdit: React.PropTypes.func.isRequired,
  },
  mixins: [IntlMixin],

  getInitialState() {
    return {
      isSubmitting: false,
    };
  },

  close() {
    this.props.onToggleModal(false);
  },

  show() {
    this.props.onToggleModal(true);
  },

  handleSubmit() {
    this.setState({
      isSubmitting: true,
    });
  },

  handleSubmitSuccess() {
    this.setState({
      isSubmitting: false,
    });
    this.close();
  },

  handleFailure() {
    this.setState({
      isSubmitting: false,
    });
  },

  render() {
    if (!this.props.form.contribuable) {
      return null;
    }
    return (
      <div>
        <Modal
          animation={false}
          show={this.props.show}
          onHide={this.close}
          bsSize="large"
          aria-labelledby="contained-modal-title-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">
              { this.getIntlMessage('global.edit') }
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div id="edit-reply-form">
            <ReplyForm
              form={this.props.form}
              reply={this.props.reply}
              isSubmitting={this.state.isSubmitting}
              onSubmitSuccess={this.handleSubmitSuccess}
              onSubmitFailure={this.handleFailure}
              onValidationFailure={this.handleFailure}
            />
          </div>
          </Modal.Body>
          <Modal.Footer>
            <CloseButton onClose={this.close} />
            <SubmitButton
              id="submit-edit-reply"
              isSubmitting={this.state.isSubmitting}
              onSubmit={this.handleSubmit}
            />
          </Modal.Footer>
        </Modal>
      </div>
    );
  },

});

export default ReplyEditModal;
