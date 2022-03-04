// @flow
import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FormattedMessage, FormattedHTMLMessage, injectIntl, type IntlShape } from 'react-intl';
import styled, { type StyledComponent } from 'styled-components';
import { Menu } from '@cap-collectif/ui';
import { mediaQueryMobile } from '~/utils/sizes';
import CommentListView, { type CommentOrderBy } from './CommentListView';
import CommentForm from './CommentForm';
import type { CommentSectionFragmented_commentable } from '~relay/CommentSectionFragmented_commentable.graphql';
import Icon, { ICON_NAME } from '~/components/Ui/Icons/Icon';
import colors from '~/utils/colors';
import Button from '~ds/Button/Button';

type Props = {|
  +intl: IntlShape,
  +commentable: CommentSectionFragmented_commentable,
  +isAuthenticated: boolean,
  +useBodyColor: boolean,
  unstable__enableCapcoUiDs?: boolean,
|};

const SortBy: StyledComponent<{}, {}, typeof Col> = styled(Col)`
  margin-bottom: 20px;
  display: flex;
  align-items: center;

  svg {
    margin-left: 20px;
    margin-right: 0;
    margin-top: 7px;
    z-index: 1;
    pointer-events: none;
  }

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    margin-top: 10px;

    svg {
      margin-left: 0;
    }
  }
`;

export const FilterButton: StyledComponent<{}, {}, typeof Button> = styled(Button)`
  border: none !important;
  outline: none !important;
  background-color: ${colors.white} !important;
  box-shadow: none !important;
`;

const filters = {
  popular: 'global.filter_popular',
  old: 'global.filter_old',
  last: 'global.filter_last',
};

export function CommentSectionView(props: Props) {
  const [order, setOrder] = useState<CommentOrderBy>('last');
  const { isAuthenticated, intl, useBodyColor, commentable, unstable__enableCapcoUiDs } = props;

  return (
    <div>
      {unstable__enableCapcoUiDs ? null : (
        <h3>
          <FormattedMessage id="proposal.tabs.comments" />
        </h3>
      )}
      <Row>
        <Col id="proposal-page-comments-counter" sm={6} className="mt-5">
          {commentable.allComments && (
            <FormattedHTMLMessage
              id="comment.list"
              values={{
                num: commentable.allComments.totalCountWithAnswers,
              }}
            />
          )}
        </Col>
        {commentable.allComments && commentable.allComments.totalCountWithAnswers > 1 && (
          <SortBy smOffset={2} sm={4} xs={12}>
            <Icon name={ICON_NAME.sort} size={20} color={colors.darkText} />
            <Menu
              disclosure={
                <FilterButton id="js-btn-visibility-step" variant="primary" variantSize="medium">
                  <FormattedMessage id={filters[order]} />
                </FilterButton>
              }>
              <Menu.List>
                <Menu.Item id="public-collect" onClick={() => setOrder('popular')}>
                  {intl.formatMessage({ id: filters.popular })}
                </Menu.Item>
                <Menu.Item id="private-collect" onClick={() => setOrder('last')}>
                  {intl.formatMessage({ id: filters.last })}
                </Menu.Item>
                <Menu.Item id="old" onClick={() => setOrder('old')}>
                  {intl.formatMessage({ id: filters.old })}
                </Menu.Item>
              </Menu.List>
            </Menu>
          </SortBy>
        )}
      </Row>
      {/* $FlowFixMe reduxForm */}
      <CommentForm commentable={commentable} />
      {/* $FlowFixMe */}
      <CommentListView
        isAuthenticated={isAuthenticated}
        order={order}
        commentable={commentable}
        useBodyColor={useBodyColor}
        unstable__enableCapcoUiDs={unstable__enableCapcoUiDs}
      />
    </div>
  );
}

export default injectIntl(CommentSectionView);
