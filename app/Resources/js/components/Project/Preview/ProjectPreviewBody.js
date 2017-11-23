// @flow
import * as React from 'react';
import moment from 'moment';
import Truncate from 'react-truncate';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { FormattedDate, FormattedMessage } from 'react-intl';
import ProjectPreviewThemes from './ProjectPreviewThemes';
import ProjectPreviewProgressBar from './ProjectPreviewProgressBar';
import ProjectPreviewCounters from './ProjectPreviewCounters';

type Props = {
  project: Object,
};

export class ProjectPreviewBody extends React.Component<Props> {
  getActualStep() {
    const { project } = this.props;

    const projectStep = project.steps.sort((a, b) => {
      const dateA = new Date(a.startAt);
      const dateB = new Date(b.startAt);
      return dateA < dateB ? -1 : dateA > dateB ? 1 : 0;
    });

    const stepClosed = projectStep.filter(step => step.status === 'closed');
    const stepFuture = projectStep.filter(step => step.status === 'future');
    const stepOpen = projectStep.filter(step => step.status === 'open');

    const stepContinuousParticipation = projectStep.filter(step => step.timeless === true);

    if (stepContinuousParticipation.length > 0) {
      return stepContinuousParticipation[0];
    } else if (stepOpen.length > 0 && stepContinuousParticipation.length === 0) {
      return stepOpen[0];
    } else if (stepClosed.length > 0 && stepOpen.length === 0 && stepFuture.length === 0) {
      return stepClosed[stepClosed.length - 1];
    } else if (stepFuture.length > 0 && stepOpen.length === 0) {
      return stepFuture[0];
    }
  }

  getAction = (step: Object) => {
    const { project } = this.props;

    if (project.hasParticipativeStep && step.status === 'open') {
      return (
        <a href={step._links.show}>
          <FormattedMessage id="project.preview.action.participe" />
        </a>
      );
    } else if (!project.hasParticipativeStep && step.status === 'open') {
      return (
        <a href={step._links.show}>
          <FormattedMessage id="project.preview.action.seeStep" />
        </a>
      );
    } else if (step.status === 'closed') {
      return (
        <a href={step._links.show}>
          <FormattedMessage id="project.preview.action.seeResult" />
        </a>
      );
    }
  };

  getStartDate = (step: Object) => {
    const startAtDate = moment(step.startAt).toDate();
    const startDay = (
      <FormattedDate value={startAtDate} day="numeric" month="long" year="numeric" />
    );

    if (step.status === 'future') {
      return (
        <span className="excerpt-dark">
          <FormattedMessage id="date.startAt" /> {startDay}
        </span>
      );
    }
  };

  getRemainingDays = (step: Object) => {
    const { project } = this.props;

    const endDate = moment(step.endAt);
    const now = moment();

    const daysLeft = endDate.diff(now, 'days');
    const hoursLeft = endDate.diff(now, 'hours');
    const minutesLeft = endDate.diff(now, 'minutes');

    let test;

    if (daysLeft === 0 && hoursLeft === 0) {
      test = (
        <span className="excerpt">
          <span className="excerpt_dark">{minutesLeft}</span>{' '}
          <FormattedMessage id="count.minutesLeft" values={{ count: minutesLeft }} />
        </span>
      );
    } else if (daysLeft === 0) {
      test = (
        <span className="excerpt">
          <span className="excerpt_dark">{hoursLeft}</span>{' '}
          <FormattedMessage id="count.hoursLeft" values={{ count: hoursLeft }} />
        </span>
      );
    } else {
      test = (
        <span className="excerpt">
          <span className="excerpt_dark">{daysLeft}</span>{' '}
          <FormattedMessage id="count.daysLeft" values={{ count: daysLeft }} />
        </span>
      );
    }

    if (project.hasParticipativeStep && step.status === 'open' && !step.timeless) {
      return test;
    }
  };

  render() {
    const { project } = this.props;

    const externalLink = project._links.external;
    const link = externalLink || project._links.show;
    const tooltip = <Tooltip id={`project-${project.id}-tooltip`}>{project.title}</Tooltip>;

    const actualStep = this.getActualStep();

    return (
      <div className="box project__preview__body">
        <div className="project__preview__body__infos">
          <ProjectPreviewThemes project={project} />
          <h4
            className="project__preview__title"
            style={{ height: 'auto', lineHeight: 'auto', margin: '5px 0' }}>
            <OverlayTrigger placement="top" overlay={tooltip}>
              <a href={link}>
                <div style={{ width: '98%' }}>
                  <Truncate lines={3}>{project.title}</Truncate>
                  {externalLink && (
                    <svg
                      style={{
                        marginLeft: 5,
                        display: 'inline-block',
                        height: 16,
                        width: 16,
                      }}
                      version="1.1"
                      id="Calque_1"
                      xmlns="http://www.w3.org/2000/svg"
                      x="0px"
                      y="0px"
                      viewBox="0 0 89.7 90.1"
                      xmlSpace="preserve">
                      <g className="externalLinkSvg">
                        <path d="M85.5,0H56.9c-2.3,0-4.2,1.9-4.2,4.2s1.9,4.2,4.2,4.2h19.1L35.1,49.2c-1.6,1.6-1.6,4.3,0,5.9c0.8,0.8,1.9,1.2,2.9,1.2
                            s2.1-0.4,2.9-1.2l40.4-40.4v18.2c0,2.3,1.9,4.2,4.2,4.2s4.2-1.9,4.2-4.2V4.2C89.7,1.9,87.8,0,85.5,0z" />
                        <path d="M71.1,41.9c-2.3,0-4.2,1.9-4.2,4.2V79c0,1.5-1.3,2.8-2.8,2.8H11.1c-1.5,0-2.8-1.3-2.8-2.8V25.9c0-1.5,1.3-2.8,2.8-2.8h33
                            c2.3,0,4.2-1.9,4.2-4.2s-1.9-4.2-4.2-4.2h-33C5,14.8,0,19.7,0,25.9V79c0,6.1,5,11.1,11.1,11.1h53.1c6.1,0,11.1-5,11.1-11.1V46.1
                            C75.3,43.8,73.4,41.9,71.1,41.9z" />
                      </g>
                    </svg>
                  )}
                </div>
              </a>
            </OverlayTrigger>
          </h4>
          {project.hasParticipativeStep && <ProjectPreviewCounters project={project} />}
        </div>
        {actualStep && <ProjectPreviewProgressBar project={project} actualStep={actualStep} />}
        <div className="project__preview__actions">
          {actualStep && this.getAction(actualStep)} {actualStep && this.getStartDate(actualStep)}{' '}
          {actualStep && this.getRemainingDays(actualStep)}
        </div>
      </div>
    );
  }
}

export default ProjectPreviewBody;
