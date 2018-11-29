// @flow
import React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import StepText from './StepText';
import { Card } from '../../Ui/Card/Card';
import type { StepInfos_step } from './__generated__/StepInfos_step.graphql';

type Props = {
  step: StepInfos_step,
};

export class StepInfos extends React.Component<Props> {
  render() {
    const { step } = this.props;
    const { body } = step;
    return body ? (
      <Card>
        <div className="card__body">
          <StepText text={body} />
        </div>
      </Card>
    ) : null;
  }
}

export default createFragmentContainer(
  StepInfos,
  graphql`
    fragment StepInfos_step on Step {
      body
    }
  `,
);
