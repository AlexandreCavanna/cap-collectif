// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createFragmentContainer, graphql } from 'react-relay';
import moment from 'moment';
import {
  Container,
  TitleContainer,
  InfoContainer,
  TagsList,
  InfoLineContainer,
  ActionContainer,
  UsernameContainer,
} from './EventPageHeader.style';
import { TYPE_EVENT } from '~/components/Event/EventPreview/EventPreview';
import TagDate from '~/components/Tag/TagDate/TagDate';
import UserAvatar from '~/components/User/UserAvatar';
import type { State } from '~/types';
import Icon, { ICON_NAME } from '~ui/Icons/Icon';
import colors from '~/utils/colors';
import Tag from '~ui/Labels/Tag';
import IconRounded from '~ui/Icons/IconRounded';
import TagThemes from '~/components/Tag/TagThemes/TagThemes';
import EventEditButton from '~/components/Event/Edit/EventEditButton';
import EventDeleteButton from '~/components/Event/Delete/EventDeleteButton';
import type { EventPageHeader_event } from '~relay/EventPageHeader_event.graphql';
import type { EventPageHeader_query } from '~relay/EventPageHeader_query.graphql';
import EventLabelStatus from '~/components/Event/EventLabelStatus';
import config from '~/config';

type Props = {
  event: EventPageHeader_event,
  query: EventPageHeader_query,
  type?: $Values<typeof TYPE_EVENT>,
  hasProfileEnabled?: boolean,
  hasThemeEnabled?: boolean,
  hasProposeEventEnabled?: boolean,
  speaker?: string,
};

export const EventPageHeader = ({
  type = TYPE_EVENT.PHYSICAL,
  event,
  query,
  hasProfileEnabled,
  hasThemeEnabled,
  hasProposeEventEnabled,
  speaker,
}: Props) => {
  const {
    title,
    googleMapsAddress,
    timeRange,
    author,
    comments,
    participants,
    themes,
    viewerDidAuthor,
  } = event;

  return (
    <Container>
      <div>
        <TitleContainer>
          {!config.isMobile && (
            <Icon
              name={type === TYPE_EVENT.ONLINE ? ICON_NAME.eventOnline : ICON_NAME.eventPhysical}
              size={30}
              color={colors.lightBlue}
            />
          )}
          <h1>{title}</h1>
        </TitleContainer>

        <InfoContainer>
          <UserAvatar user={author} size={60} />

          <div>
            <UsernameContainer>
              {hasProfileEnabled && author ? (
                <a href={author.url} className="username">
                  {author.username}
                </a>
              ) : (
                <span className="username">author.username</span>
              )}

              {viewerDidAuthor && hasProposeEventEnabled && <EventLabelStatus event={event} />}
            </UsernameContainer>

            <TagsList>
              {timeRange?.startAt && !timeRange?.endAt ? (
                <TagDate date={timeRange.startAt} size="16px" />
              ) : (
                <Tag
                  size="16px"
                  CustomImage={<Icon name={ICON_NAME.clock} color={colors.darkGray} size={22} />}>
                  <FormattedMessage
                    id="date.start.to.date.end"
                    values={{
                      dateStart: moment(timeRange.startAt).format('MMMM Do YYYY, h:mm:ss a'),
                      dateEnd: moment(timeRange.endAt).format('MMMM Do YYYY, h:mm:ss a'),
                    }}
                  />
                </Tag>
              )}

              {timeRange?.startAt && timeRange?.endAt && type === TYPE_EVENT.ONLINE && (
                <Tag
                  size="16px"
                  CustomImage={
                    <IconRounded size={18} color={colors.darkGray}>
                      <Icon name={ICON_NAME.calendar} color="#fff" size={10} />
                    </IconRounded>
                  }>
                  {moment.duration(moment(timeRange.startAt).diff(timeRange.endAt))}
                </Tag>
              )}

              {hasThemeEnabled && themes && themes.length > 0 && (
                <TagThemes themes={themes} size="16px" />
              )}

              {speaker && (
                <Tag
                  size="16px"
                  CustomImage={
                    <IconRounded size={18} color={colors.darkGray}>
                      <Icon name={ICON_NAME.micro} color="#fff" size={10} />
                    </IconRounded>
                  }>
                  <FormattedMessage id="driven.by" />
                  {' : '}
                  {speaker}
                </Tag>
              )}

              {googleMapsAddress?.formatted && (
                <Tag
                  size="16px"
                  CustomImage={
                    <IconRounded size={18} color={colors.darkGray}>
                      <Icon name={ICON_NAME.pin2} color="#fff" size={10} />
                    </IconRounded>
                  }>
                  {googleMapsAddress.formatted}
                </Tag>
              )}
            </TagsList>
          </div>
        </InfoContainer>

        <InfoLineContainer>
          <div>
            <span className="number">{comments.totalCount}</span>
            <FormattedMessage id="comment.dynamic" values={{ num: comments.totalCount }} />
          </div>
          <div>
            <span className="number">{participants.totalCount}</span>
            <FormattedMessage id="registered.dynamic" values={{ num: participants.totalCount }} />
          </div>
        </InfoLineContainer>

        {viewerDidAuthor && hasProposeEventEnabled && (
          <ActionContainer>
            {event.review && event.review.status !== 'APPROVED' && (
              <EventEditButton event={event} query={query} />
            )}
            <EventDeleteButton eventId={event.id} />
          </ActionContainer>
        )}
      </div>
    </Container>
  );
};

const mapStateToProps = (state: State) => ({
  hasProfileEnabled: state.default.features.profiles,
  hasThemeEnabled: state.default.features.themes,
  hasProposeEventEnabled: state.default.features.allow_users_to_propose_events,
});

const EventPageHeaderConnected = connect(mapStateToProps)(EventPageHeader);

export default createFragmentContainer(EventPageHeaderConnected, {
  query: graphql`
    fragment EventPageHeader_query on Query
      @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      ...EventEditButton_query @arguments(isAuthenticated: $isAuthenticated)
    }
  `,
  event: graphql`
    fragment EventPageHeader_event on Event
      @argumentDefinitions(isAuthenticated: { type: "Boolean!" }) {
      id
      title
      viewerDidAuthor @include(if: $isAuthenticated)
      timeRange {
        startAt
        endAt
      }
      googleMapsAddress {
        formatted
      }
      themes {
        title
      }
      author {
        username
        url
        ...UserAvatar_user
      }
      review {
        status
      }
      comments {
        totalCount
      }
      participants {
        totalCount
      }
      ...EventLabelStatus_event
      ...EventEditButton_event
    }
  `,
});