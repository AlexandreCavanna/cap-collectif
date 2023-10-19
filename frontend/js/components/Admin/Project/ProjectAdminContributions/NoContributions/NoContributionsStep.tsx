import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import cn from 'classnames'
import { FormattedMessage } from 'react-intl'
import { Container, Tiles } from './NoContributionsStep.style'
import Icon, { ICON_NAME } from '~ui/Icons/Icon'
import colors from '~/utils/colors'
import type { NoContributionsStep_project } from '~relay/NoContributionsStep_project.graphql'
import type { NoContributionsStep_viewer } from '~relay/NoContributionsStep_viewer.graphql'

type Props = {
  project: NoContributionsStep_project
  viewer: NoContributionsStep_viewer
}

const NoContributionsStep = ({ project, viewer }: Props) => {
  const hasConsultationStep = project.steps.filter(({ __typename }) => __typename === 'ConsultationStep').length > 0
  return (
    <Container>
      <FormattedMessage id="help.title.no-deposition-step" tagName="p" />
      {hasConsultationStep && viewer.isAdmin && <FormattedMessage id="help.text.no-deposition-step" tagName="p" />}

      {hasConsultationStep && viewer.isAdmin && (
        <Tiles>
          {hasConsultationStep && (
            <>
              <li>
                <a
                  href={`/admin/capco/app/opinion/list?filter[consultation__step__projectAbstractStep__project][value]=${project._id}`}
                  className={cn({
                    disabled: project?.proposalConsultation.totalCount === 0,
                  })}
                >
                  <Icon name={ICON_NAME.bookmark} size={40} color={colors.darkGray} />
                  <FormattedMessage
                    id="shortcut.proposition.consultation"
                    values={{
                      num: project.proposalConsultation.totalCount,
                    }}
                  />
                </a>
              </li>

              <li>
                <a
                  href={`/admin/capco/app/argument/list?filter[opinion__consultation__step__projectAbstractStep__project][value]=${project._id}`}
                  className={cn({
                    disabled: project.argument.totalCount === 0,
                  })}
                >
                  <Icon name={ICON_NAME.argument} size={40} color={colors.darkGray} />
                  <FormattedMessage
                    id="shortcut.opinion"
                    values={{
                      num: project.argument.totalCount,
                    }}
                  />
                </a>
              </li>

              <li>
                <a
                  href={`/admin/capco/app/opinionversion/list?filter[parent__consultation__step__projectAbstractStep__project][value]=${project._id}`}
                  className={cn({
                    disabled: project.amendement.totalCount === 0,
                  })}
                >
                  <Icon name={ICON_NAME.legalHammer} size={40} color={colors.darkGray} />
                  <FormattedMessage
                    id="shortcut-amendments"
                    values={{
                      num: project.amendement.totalCount,
                    }}
                  />
                </a>
              </li>

              <li>
                <a
                  href={`/admin/capco/app/source/list?filter[opinion__consultation__step__projectAbstractStep__project][value]=${project._id}`}
                  className={cn({
                    disabled: project.source.totalCount === 0,
                  })}
                >
                  <Icon name={ICON_NAME.messageBubbleSearch} size={40} color={colors.darkGray} />
                  <FormattedMessage
                    id="shortcut.sources"
                    values={{
                      num: project.source.totalCount,
                    }}
                  />
                </a>
              </li>
            </>
          )}
        </Tiles>
      )}
    </Container>
  )
}

export default createFragmentContainer(NoContributionsStep, {
  viewer: graphql`
    fragment NoContributionsStep_viewer on User {
      isAdmin
    }
  `,
  project: graphql`
    fragment NoContributionsStep_project on Project {
      _id
      steps {
        __typename
      }
      amendement: contributions(type: OPINIONVERSION) {
        totalCount
      }
      source: contributions(type: SOURCE) {
        totalCount
      }
      argument: contributions(type: ARGUMENT) {
        totalCount
      }
      proposalConsultation: contributions(type: OPINION) {
        totalCount
      }
    }
  `,
})
