// @flow
import React from 'react';
import { Col } from 'react-bootstrap';
import styled, { type StyledComponent } from 'styled-components';
import { graphql, createFragmentContainer } from 'react-relay';
import { connect } from 'react-redux';
import ProposalPreviewBody from './ProposalPreviewBody';
import ProposalPreviewFooter from './ProposalPreviewFooter';
import ProposalPreviewStatus from './ProposalPreviewStatus';
import { Card } from '~/components/Ui/Card/Card';
import type { ProposalPreview_proposal } from '~relay/ProposalPreview_proposal.graphql';
import type { ProposalPreview_step } from '~relay/ProposalPreview_step.graphql';
import type { ProposalPreview_viewer } from '~relay/ProposalPreview_viewer.graphql';
import type { FeatureToggles, State } from '~/types';
import CategoryBackground from '~/components/Ui/Medias/CategoryBackground';
import Icon, { ICON_NAME } from '~/components/Ui/Icons/Icon';
import colors from '~/utils/colors';
import { bootstrapGrid } from '~/utils/sizes';
import Image from '~ui/Primitives/Image';

type Props = {|
  +proposal: ProposalPreview_proposal,
  +step: ?ProposalPreview_step,
  +viewer: ?ProposalPreview_viewer,
  +features: FeatureToggles,
  +isSPA?: boolean,
|};

const ProposalCard: StyledComponent<{}, {}, typeof Card> = styled(Card)`
  > svg {
    position: absolute;
    left: calc(50% - 20px);
    z-index: auto;
    top: 20px;

    @media (max-width: ${bootstrapGrid.mdMax}px) {
      top: 25px;
    }

    @media (max-width: ${bootstrapGrid.smMax}px) {
      top: 30px;
    }

    @media (max-width: ${bootstrapGrid.xsMax}px) {
      top: 9.5vw;
    }
  }

  #background {
    position: initial;
    z-index: auto;
  }
`;

const ProposalImage: StyledComponent<{}, {}, typeof Image> = styled(Image)`
  border-radius: 4px 4px 0 0;
  height: 83px;
  max-width: 261px;
  object-position: center;
  object-fit: cover;

  @media (max-width: ${bootstrapGrid.mdMax}px) {
    max-width: 293px;
  }

  @media (max-width: ${bootstrapGrid.smMax}px) {
    max-width: 345px;
    height: 99px;
  }

  @media (max-width: 838px) {
    max-width: 900px;
  }

  @media (max-width: ${bootstrapGrid.xsMax}px) {
    height: 27.5vw;
  }
`;

const getCategoryImage = (proposal: ProposalPreview_proposal) => {
  return proposal?.category?.categoryImage?.image?.url;
};

export class ProposalPreview extends React.Component<Props> {
  render() {
    const { proposal, step, viewer, features, isSPA } = this.props;
    return (
      <Col componentClass="li" xs={12} sm={6} md={4} lg={3}>
        <ProposalCard
          id={`proposal-${proposal.id}`}
          className={
            proposal.author && proposal.author.vip
              ? 'bg-vip proposal-preview block--shadowed'
              : 'block--shadowed proposal-preview'
          }>
          {proposal.media &&
          proposal.media.url &&
          features.display_pictures_in_depository_proposals_list ? (
            <ProposalImage src={proposal.media.url} />
          ) : features.display_pictures_in_depository_proposals_list ? (
            getCategoryImage(proposal) ? (
              <ProposalImage src={getCategoryImage(proposal)} />
            ) : (
              <>
                <CategoryBackground color={proposal?.category?.color || '#1E88E5'} />
                {proposal?.category?.icon && (
                  <Icon name={ICON_NAME[proposal?.category?.icon]} size={40} color={colors.white} />
                )}
              </>
            )
          ) : null}
          <ProposalPreviewBody proposal={proposal} step={step} viewer={viewer} isSPA={isSPA} />
          {step && <ProposalPreviewFooter step={step} proposal={proposal} />}
          <ProposalPreviewStatus proposal={proposal} />
        </ProposalCard>
      </Col>
    );
  }
}

const mapStateToProps = (state: State) => ({
  features: state.default.features,
});

export default createFragmentContainer(
  connect<any, any, _, _, _, _>(mapStateToProps)(ProposalPreview),
  {
    viewer: graphql`
      fragment ProposalPreview_viewer on User @argumentDefinitions(stepId: { type: "ID!" }) {
        ...ProposalPreviewBody_viewer @arguments(stepId: $stepId)
      }
    `,
    step: graphql`
      fragment ProposalPreview_step on Step {
        ...ProposalPreviewBody_step
        ...ProposalPreviewFooter_step
      }
    `,
    proposal: graphql`
      fragment ProposalPreview_proposal on Proposal
      @argumentDefinitions(
        stepId: { type: "ID!" }
        isAuthenticated: { type: "Boolean!" }
        isProfileView: { type: "Boolean", defaultValue: false }
        token: { type: "String" }
      ) {
        id
        media {
          url
        }
        author {
          vip
        }
        category {
          icon
          color
          categoryImage {
            id
            image {
              url
            }
          }
        }
        ...ProposalPreviewFooter_proposal @arguments(stepId: $stepId, isProfileView: $isProfileView)
        ...ProposalPreviewBody_proposal
          @arguments(
            isAuthenticated: $isAuthenticated
            isProfileView: $isProfileView
            stepId: $stepId
            token: $token
          )
        ...ProposalPreviewStatus_proposal @arguments(stepId: $stepId, isProfileView: $isProfileView)
      }
    `,
  },
);
