const OpinionLinkCreateInfos = React.createClass({
  propTypes: {
    opinion: React.PropTypes.object.isRequired,
  },
  mixins: [ReactIntl.IntlMixin],

  render() {
    return (
      <div>
        <div className="modal-top bg-info">
          <p>
            { this.getIntlMessage('source.infos') }
          </p>
        </div>
        <p>
          { this.getIntlMessage('opinion.link.info') }
          { ' ' }
          <a href={this.props.opinion._links.show}>
            { this.props.opinion.title }
          </a>
        </p>
      </div>
    );
  },

});

export default OpinionLinkCreateInfos;
