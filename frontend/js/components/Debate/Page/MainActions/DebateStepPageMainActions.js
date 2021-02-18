// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { graphql, createFragmentContainer } from 'react-relay';
import ReactPlaceholder from 'react-placeholder';
import moment from 'moment';
import type { DebateStepPageMainActions_step } from '~relay/DebateStepPageMainActions_step.graphql';
import AppBox from '~ui/Primitives/AppBox';
import Flex from '~ui/Primitives/Layout/Flex';
import Tag from '~ds/Tag/Tag';
import Heading from '~ui/Primitives/Heading';
import RemainingTime from '~/components/Utils/RemainingTime';
import DebateStepPageMainActionsPlaceholder from './DebateStepPageMainActionPlaceholder';
import DebateStepPageVoteAndShare from './DebateStepPageVoteAndShare';

type Props = {|
  +step: ?DebateStepPageMainActions_step,
  +isMobile: boolean,
  +title: string,
  +isAuthenticated: boolean,
|};

export const DebateStepPageMainActions = ({ step, title, isMobile, isAuthenticated }: Props) => {
  const intl = useIntl();

  if (!step) return null;

  const isStepFinished = step.timeless
    ? false
    : step?.timeRange?.endAt
    ? moment().isAfter(moment(step.timeRange.endAt))
    : false;
  const isStartedAndNoEndDate = step.timeless
    ? false
    : !step?.timeRange?.endAt && moment().isAfter(moment(step.timeRange.startAt));
  const isStepClosed = isStepFinished || isStartedAndNoEndDate;

  return (
    <AppBox id={step ? 'DebateStepPageMainActions' : 'DebateStepPageMainActionsLoading'}>
      <ReactPlaceholder ready={!!step} customPlaceholder={<DebateStepPageMainActionsPlaceholder />}>
        <Flex direction="column" alignItems="center" spacing={4}>
          {isStepClosed && (
            <Tag variantType="badge" variant="neutral-gray" icon="CLOCK">
              {intl.formatMessage({ id: 'global.ended' })}
            </Tag>
          )}

          {!isStepClosed && step?.timeRange?.endAt && (
            <Tag variantType="badge" variant="yellow" icon="CLOCK">
              <RemainingTime noStyle endAt={step?.timeRange?.endAt} />
            </Tag>
          )}

          <Heading as="h2" mb={2} textAlign="center" color="gray.900">
            {title}
          </Heading>
          {step && (
            <DebateStepPageVoteAndShare
              isMobile={isMobile}
              title={title}
              isAuthenticated={isAuthenticated}
              step={step}
            />
          )}
        </Flex>
      </ReactPlaceholder>
    </AppBox>
  );
};

export default createFragmentContainer(DebateStepPageMainActions, {
  step: graphql`
    fragment DebateStepPageMainActions_step on DebateStep {
      timeless
      timeRange {
        startAt
        endAt
      }
      ...DebateStepPageVoteAndShare_step @arguments(isAuthenticated: $isAuthenticated)
    }
  `,
});
