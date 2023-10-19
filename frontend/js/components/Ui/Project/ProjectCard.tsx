import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { useIntl } from 'react-intl'
import { connect } from 'react-redux'
import type { ProjectCard_project } from '~relay/ProjectCard_project.graphql'
import Flex from '~ui/Primitives/Layout/Flex'
import Heading from '~ui/Primitives/Heading'
import type { AppBoxProps } from '~ui/Primitives/AppBox.type'
import AppBox from '~ui/Primitives/AppBox'
import { ICON_NAME } from '~ds/Icon/Icon'
import type { State } from '~/types'
import Card from '~ds/Card/Card'
import { FontWeight, LineHeight } from '~ui/Primitives/constants'
import DefaultProjectImage from '~/components/Project/Preview/DefaultProjectImage'
import useIsMobile from '~/utils/hooks/useIsMobile'
import { formatInfo, formatCounter, renderTag } from './ProjectCard.utils'
import Image from '~ui/Primitives/Image'
import htmlDecode from '~/components/Utils/htmlDecode'
type Props = AppBoxProps & {
  readonly project: ProjectCard_project
  readonly backgroundColor: string
  readonly isProjectsPage: boolean
  readonly variantSize?: 'L' | 'M'
}

export const ProjectCard = ({
  project,
  backgroundColor,
  isProjectsPage,
  gridArea,
  width,
  height,
  p,
  px,
  py,
  variantSize,
  ...props
}: Props) => {
  const intl = useIntl()
  const isMobile = useIsMobile()
  const showCounters = project.hasParticipativeStep || project.isExternal
  return (
    <AppBox
      as="a"
      href={project.externalLink || project.url}
      display="grid"
      gridArea={gridArea}
      width={width || '100%'}
      height={height || '100%'}
      p={p}
      px={px}
      py={py}
      css={{
        '&:hover': {
          textDecoration: 'none',
        },
      }}
    >
      <Card
        bg="white"
        p={0}
        flexDirection={variantSize === 'L' ? 'row' : 'column'}
        overflow="hidden"
        display="flex"
        border="unset"
        boxShadow="small"
        position="relative"
        {...props}
      >
        {project.cover?.url ? (
          <Image
            overflow="hidden"
            src={project.cover?.url}
            css={{
              objectFit: 'cover',
              objectPosition: 'left top',
              aspectRatio: '3 / 2',
              filter: project.archived ? 'grayscale(1)' : null,
              opacity: project.archived ? '50%' : null,
            }}
            position="relative"
            width={variantSize === 'L' ? '50%' : '100%'}
            sizes="(max-width: 320px) 320px,
        (max-width: 640px) 640px,
        (max-width: 960px) 960px,
        (max-width: 1280px) 960px,
        (max-width: 2560px) 960px,"
          />
        ) : (
          <AppBox
            overflow="hidden"
            css={{
              background: backgroundColor,
              backgroundSize: 'cover',
              filter: project.archived ? 'grayscale(1)' : null,
              opacity: project.archived ? '50%' : null,
            }}
            position="relative"
            width={variantSize === 'L' ? '50%' : '100%'}
            pt={variantSize === 'L' ? '300px' : variantSize === 'M' ? '33.33%' : '66.66%'} // 3:2 aspect ratio trick
          >
            {!project.cover?.url && <DefaultProjectImage isNewCard />}
          </AppBox>
        )}

        {renderTag(project, intl, isProjectsPage)}
        <Flex direction="column" m={4} bg="white" flex={1} overflow="hidden">
          <Heading
            truncate={100}
            as="h4"
            fontWeight={FontWeight.Semibold}
            mb={4}
            color={project.archived ? 'gray.500' : 'gray.900'}
            lineHeight={LineHeight.Base}
          >
            {htmlDecode(project.title)}
          </Heading>
          <Flex direction="column" justifyContent="space-between" height="100%">
            {(isProjectsPage || !isMobile) && (
              <Flex direction="row" flexWrap="wrap" color="neutral-gray.700">
                {project.type &&
                  formatInfo(
                    ICON_NAME.BOOK_STAR_O,
                    intl.formatMessage({
                      id: project.type.title,
                    }),
                    project.archived,
                    project.type?.color,
                  )}{' '}
                {project.districts &&
                  project.districts?.totalCount > 0 &&
                  formatInfo(
                    ICON_NAME.PIN_O,
                    project.districts.edges?.map(district => district?.node?.name).join(' • ') || null,
                    project.archived,
                  )}
                {project.themes &&
                  project.themes?.length > 0 &&
                  formatInfo(
                    ICON_NAME.FOLDER_O,
                    project.themes?.map(({ title }) => title).join(', ') || '',
                    project.archived,
                  )}
              </Flex>
            )}
            {showCounters && (
              <Flex direction="row" spacing={8} mt={4}>
                {(project.isVotesCounterDisplayable &&
                  ((project.isExternal && project.externalVotesCount) || project.votes.totalCount) &&
                  formatCounter(
                    ICON_NAME.THUMB_UP_O,
                    project.isExternal ? project.externalVotesCount || 0 : project.votes.totalCount,
                    project.archived,
                  )) ||
                  null}
                {(project.isContributionsCounterDisplayable &&
                  formatCounter(
                    ICON_NAME.BUBBLE_O,
                    project.isExternal ? project.externalContributionsCount || 0 : project.contributions.totalCount,
                    project.archived,
                  )) ||
                  null}
                {(project.isParticipantsCounterDisplayable &&
                  formatCounter(
                    ICON_NAME.USER_O,
                    project.isExternal
                      ? project.externalParticipantsCount || 0
                      : project.contributors.totalCount +
                          project.anonymousVotes.totalCount +
                          project.anonymousReplies?.totalCount,
                    project.archived,
                  )) ||
                  null}
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card>
    </AppBox>
  )
}

const mapStateToProps = (state: State) => ({
  backgroundColor: state.default.parameters['color.btn.primary.bg'],
})

ProjectCard.displayName = 'ProjectCard'
export default createFragmentContainer(connect<any, any>(mapStateToProps)(ProjectCard), {
  project: graphql`
    fragment ProjectCard_project on Project {
      id
      title
      type {
        title
        color
      }
      themes {
        title
      }
      cover {
        url
      }
      isExternal
      externalLink
      url
      isVotesCounterDisplayable
      isContributionsCounterDisplayable
      isParticipantsCounterDisplayable
      archived
      votes {
        totalCount
      }
      anonymousVotes: votes(anonymous: true) {
        totalCount
      }
      contributions {
        totalCount
      }
      contributors {
        totalCount
      }
      anonymousReplies: contributions(type: REPLY_ANONYMOUS) {
        totalCount
      }
      hasParticipativeStep
      externalParticipantsCount
      externalContributionsCount
      externalVotesCount
      districts {
        totalCount
        edges {
          node {
            name
          }
        }
      }
      visibility
      publishedAt
      steps {
        state
        __typename
      }
      currentStep {
        id
        timeless
        state
        timeRange {
          endAt
        }
      }
    }
  `,
})
