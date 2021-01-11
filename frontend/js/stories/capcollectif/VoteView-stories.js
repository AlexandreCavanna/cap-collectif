// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { number } from 'storybook-addon-knobs';
import VoteView from '~/components/Ui/Vote/VoteView';

storiesOf('Cap Collectif | VoteView', module)
  .add('default case', () => (
    <VoteView positivePercentage={number('positivePercentage', 70, 'positivePercentage')} />
  ))
  .add('mobile case', () => (
    <VoteView
      positivePercentage={number('positivePercentage', 70, 'positivePercentage')}
      isMobile
    />
  ));