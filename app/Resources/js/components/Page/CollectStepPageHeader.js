import CreateProposal from '../Proposal/Create/CreateProposal';

const Col = ReactBootstrap.Col;
const Row = ReactBootstrap.Row;
const FormattedMessage = ReactIntl.FormattedMessage;

const CollectStepPageHeader = React.createClass({
  propTypes: {
    form: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  render() {
    return (
      <div>
        <Row>
          <Col xs={3}>
            <FormattedMessage
              message={this.getIntlMessage('proposal.count')}
              num={0}
            />
          </Col>
          <Col xs={3}>
            <CreateProposal form={this.props.form} />
          </Col>
        </Row>
        <Row>
          <p>{this.props.form.description}</p>
        </Row>
      </div>
    );
  },

});

export default CollectStepPageHeader;
