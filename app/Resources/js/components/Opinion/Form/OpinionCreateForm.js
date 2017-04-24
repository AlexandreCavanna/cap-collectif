// @flow
import React, { PropTypes } from 'react';
import { IntlMixin } from 'react-intl';
import OpinionForm, { defaultValidation } from './OpinionForm';
import Fetcher, { json } from '../../../services/Fetcher';
import type { Dispatch } from '../../../types';

const onSubmit = (data: Object, dispatch: Dispatch, props: Object) => {
  const { opinionType, projectId, stepId, onFailure } = props;
  const appendices = opinionType.appendixTypes
    .filter(type => data[type.title] && data[type.title].length > 0)
    .map(type => ({ appendixType: type.id, body: data[type.title] }));
  const form = {
    title: data.title,
    body: data.body,
    appendices,
  };
  return Fetcher.post(
    `/projects/${projectId}/steps/${stepId}/opinion_types/${opinionType.id}/opinions`,
    form,
  )
    .then(json)
    .then((opinion: Object) => {
      window.location.href = opinion._links.show;
    })
    .catch(onFailure);
};

export const OpinionCreateForm = React.createClass({
  propTypes: {
    projectId: PropTypes.string.isRequired,
    stepId: PropTypes.number.isRequired,
    opinionType: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
  },
  mixins: [IntlMixin],

  render() {
    const { opinionType, step } = this.props;
    if (!opinionType) return;
    const dynamicsField = opinionType.appendixTypes.map(type => ({
      name: type.title,
      label: type.title,
      type: 'editor',
      id: `appendix_${type.id}`,
    }));
    return (
      <OpinionForm
        form="opinion-create-form"
        validate={defaultValidation}
        onSubmit={onSubmit}
        fields={[
          {
            name: 'title',
            label: 'title',
            type: 'text',
            id: 'opinion_title',
            help: step.titleHelpText,
          },
          {
            name: 'body',
            label: 'body',
            type: 'editor',
            id: 'opinion_body',
            help: step.descriptionHelpText,
          },
        ].concat(dynamicsField)}
      />
    );
  },
});

export default OpinionCreateForm;
