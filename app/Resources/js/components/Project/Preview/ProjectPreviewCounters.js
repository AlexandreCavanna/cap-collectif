// @flow
import * as React from 'react';
import { graphql, createFragmentContainer } from 'react-relay';
import ProjectPreviewCounter from './ProjectPreviewCounter';
import Tag from '../../Ui/Labels/Tag';
import TagsList from '../../Ui/List/TagsList';
import InlineList from '../../Ui/List/InlineList';
import ProjectRestrictedAccessFragment from '../Page/ProjectRestrictedAccessFragment';
import type { ProjectPreviewCounters_project } from '~relay/ProjectPreviewCounters_project.graphql';

type Props = {
  project: ProjectPreviewCounters_project,
};

export class ProjectPreviewCounters extends React.Component<Props> {
  render() {
    const { project } = this.props;

    return (
      <TagsList>
        {project.isContributionsCounterDisplayable && (
          <ProjectPreviewCounter
            value={project.contributionsCount ? project.contributionsCount : 0}
            label="project.preview.counters.contributions"
            showZero
            icon="cap-baloon-1"
          />
        )}
        {project.isVotesCounterDisplayable && (
          <ProjectPreviewCounter
            value={project.votes.totalCount}
            label="project.preview.counters.votes"
            icon="cap-hand-like-2-1"
          />
        )}
        {project.isParticipantsCounterDisplayable && (
          <ProjectPreviewCounter
            value={project.contributors.totalCount + project.contributors.anonymousCount}
            label="project.preview.counters.contributors"
            showZero
            icon="cap-user-2-1"
          />
        )}
        {project.districts && project.districts.length > 0 && (
          <Tag icon="cap cap-marker-1-1">
            <InlineList separator="," className="d-i">
              {project.districts &&
                project.districts.map((district, key) => (
                  <li key={key}>{district && district.name}</li>
                ))}
            </InlineList>
          </Tag>
        )}

        {/* $FlowFixMe */}
        <ProjectRestrictedAccessFragment project={project} icon="cap-lock-2-1" />
      </TagsList>
    );
  }
}

export default createFragmentContainer(ProjectPreviewCounters, {
  project: graphql`
    fragment ProjectPreviewCounters_project on Project {
      id
      isVotesCounterDisplayable
      isContributionsCounterDisplayable
      isParticipantsCounterDisplayable
      districts {
        name
      }
      contributors {
        totalCount
        anonymousCount
      }
      votes {
        totalCount
      }
      contributionsCount
      ...ProjectRestrictedAccessFragment_project
    }
  `,
});
