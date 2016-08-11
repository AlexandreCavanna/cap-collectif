/* eslint-env mocha */
/* eslint no-unused-expressions:0 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import IntlData from '../../../translations/FR';
import { IdeaDeleteVoteForm } from './IdeaDeleteVoteForm';

const props = {
  idea: {},
  isSubmitting: false,
  onSubmitSuccess: () => {},
  onFailure: () => {},
  anonymous: false,
};

describe('<IdeaDeleteVoteForm />', () => {
  it('should render the idea vote form', () => {
    const wrapper = shallow(<IdeaDeleteVoteForm {...props} {...IntlData} />);
    const form = wrapper.find('IdeaVoteForm');
    expect(form).to.have.length(1);
    expect(form.prop('idea')).to.equal(props.idea);
  });
});
