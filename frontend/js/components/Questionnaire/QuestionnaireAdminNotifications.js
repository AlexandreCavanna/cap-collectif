// @flow
import * as React from 'react';
import { useIntl } from 'react-intl';
import { graphql, useFragment } from 'react-relay';
import { Button, ButtonToolbar } from 'react-bootstrap';
import { Field, reduxForm } from 'redux-form';
import component from '~/components/Form/Field';
import AlertForm from '~/components/Alert/AlertForm';
import type {Dispatch} from '~/types';
import UpdateQuestionnaireNotificationConfigurationMutation from '~/mutations/UpdateQuestionnaireNotificationConfigurationMutation';
import type { QuestionnaireAdminNotifications_questionnaire } from '~relay/QuestionnaireAdminNotifications_questionnaire.graphql';
import AppBox from '~ui/Primitives/AppBox';
import { type QuestionnaireAdminNotifications_questionnaire$key } from '~relay/QuestionnaireAdminNotifications_questionnaire.graphql';
import type {QuestionnaireAdminNotifications_viewer$key} from "~relay/QuestionnaireAdminNotifications_viewer.graphql";

const formName = 'questionnaire-admin-notifications';

type QuestionnaireProps = {|
  +questionnaire: QuestionnaireAdminNotifications_questionnaire,
|};

type QuestionnaireFragmentProps = {|
  +questionnaire: QuestionnaireAdminNotifications_questionnaire$key,
  +viewer: QuestionnaireAdminNotifications_viewer$key,
|};

type Props = {|
  ...ReduxFormFormProps,
  ...QuestionnaireFragmentProps,
|};

const onSubmit = (values: Object, dispatch: Dispatch, props: QuestionnaireProps) => {
  const { questionnaire } = props;
  values.questionnaireId = questionnaire.id;

  return UpdateQuestionnaireNotificationConfigurationMutation.commit({
    input: {
      ...values,
    },
  });
};

const QUESTIONNAIRE_FRAGMENT = graphql`
  fragment QuestionnaireAdminNotifications_questionnaire on Questionnaire {
    id
    creator {
      email
    }
    notificationsConfiguration {
      email
      onQuestionnaireReplyCreate
      onQuestionnaireReplyUpdate
      onQuestionnaireReplyDelete
    }
  }
`;

const VIEWER_FRAGMENT = graphql`
  fragment QuestionnaireAdminNotifications_viewer on User {
    isOnlyProjectAdmin
    organizations {
      id
    }
  }
`


const QuestionnaireAdminNotifications = ({
  handleSubmit,
  valid,
  invalid,
  pristine,
  submitting,
  submitFailed,
  submitSucceeded,
  viewer: viewerRef
}: Props) => {
  const intl = useIntl();

  const viewer = useFragment(VIEWER_FRAGMENT, viewerRef);
  const showEmailField = viewer?.isOnlyProjectAdmin || viewer?.organizations?.[0];

  return (
    <div className="box box-primary container-fluid">
      <div className="box-content">
        <form onSubmit={handleSubmit}>
          <h4 className="mb-3 mt-20">
            {intl.formatMessage({ id: 'notification.answer.created' })}
          </h4>
          <Field
            name="onQuestionnaireReplyCreate"
            component={component}
            type="checkbox"
            id="on_questionnaire_reply_create">
            {intl.formatMessage({ id: 'proposal_form.notifications.on_create' })}
          </Field>
          <Field
            name="onQuestionnaireReplyUpdate"
            component={component}
            type="checkbox"
            id="on_questionnaire_reply_update">
            {intl.formatMessage({ id: 'global.modified' })}
          </Field>
          <Field
            name="onQuestionnaireReplyDelete"
            component={component}
            type="checkbox"
            id="on_questionnaire_reply_delete">
            {intl.formatMessage({ id: 'global.deleted.feminine' })}
          </Field>
          {showEmailField && (
            <AppBox width="250px">
              <Field
                name="email"
                component={component}
                type="email"
                id="email"
                label={intl.formatMessage({ id: 'receipt-email' })}
              />
            </AppBox>
          )}

          <ButtonToolbar className="box-content__toolbar">
            <Button
              disabled={invalid || pristine || submitting}
              id="parameters-submit"
              type="submit"
              bsStyle="primary">
              {intl.formatMessage({ id: submitting ? 'global.loading' : 'global.save' })}
            </Button>
            <Button bsStyle="danger" disabled>
              {intl.formatMessage({ id: 'global.delete' })}
            </Button>
            <AlertForm
              valid={valid}
              invalid={invalid}
              submitSucceeded={submitSucceeded}
              submitFailed={submitFailed}
              submitting={submitting}
            />
          </ButtonToolbar>
        </form>
      </div>
    </div>
  );
};

const form = reduxForm({
  onSubmit,
  enableReinitialize: true,
  form: formName,
})(QuestionnaireAdminNotifications);

function injectProp(Component) {
  return function WrapperComponent(props: QuestionnaireFragmentProps) {
    const { questionnaire: questionnaireFragment, viewer: viewerFragment } = props;
    const questionnaire = useFragment(QUESTIONNAIRE_FRAGMENT, questionnaireFragment);
    const viewer = useFragment(VIEWER_FRAGMENT, viewerFragment);
    const { notificationsConfiguration } = questionnaire;
    const creator = questionnaire?.creator;

    const showEmailField = (viewer?.isOnlyProjectAdmin || !!viewer?.organizations?.[0]) ?? false;

    const initialValues = {
      email: showEmailField ? notificationsConfiguration.email ?? creator?.email : null,
      onQuestionnaireReplyCreate: notificationsConfiguration.onQuestionnaireReplyCreate,
      onQuestionnaireReplyUpdate: notificationsConfiguration.onQuestionnaireReplyUpdate,
      onQuestionnaireReplyDelete: notificationsConfiguration.onQuestionnaireReplyDelete,
    };

    return <Component {...props} questionnaire={questionnaire} initialValues={initialValues} />;
  };
}

const container = (injectProp(form): React.AbstractComponent<QuestionnaireFragmentProps>);

export default container;
