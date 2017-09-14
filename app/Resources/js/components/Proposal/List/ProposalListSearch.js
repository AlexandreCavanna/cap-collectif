import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import { changeTerm, loadProposals, changeFilter } from '../../../redux/modules/proposal';
import Input from '../../Form/Input';
import type { State } from '../../../types';

const ProposalListSearch = React.createClass({
  propTypes: {
    dispatch: PropTypes.func.isRequired,
    terms: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      terms: this.props.terms,
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    let value = this._input.getWrappedInstance().getValue();
    value = value.length > 0 ? value : null;
    this.props.dispatch(changeTerm(value));
    this.props.dispatch(changeFilter('terms', value));
    this.props.dispatch(loadProposals(null, true));
  },

  handleChange(event) {
    this.setState({ terms: event.target.value });
  },

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          id="proposal-search-input"
          type="text"
          ref={c => (this._input = c)}
          placeholder="proposal.search"
          buttonAfter={
            <Button id="proposal-search-button" type="submit">
              <i className="cap cap-magnifier" />
            </Button>
          }
          groupClassName="proposal-search-group pull-right"
          value={this.state.terms}
          onChange={this.handleChange}
        />
      </form>
    );
  },
});

const mapStateToProps = (state: State) => {
  return {
    terms:
      state.proposal.filters && state.proposal.filters.terms ? state.proposal.filters.terms : '',
  };
};

export default connect(mapStateToProps)(ProposalListSearch);
