// @flow
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Field, reduxForm, formValueSelector } from 'redux-form';
import renderInput from '../../Form/Field';
import { renderSelect } from '../../Form/Select';

const formName = 'proposal';

const validate = values => {
  const errors = {};
  if (!values.title) {
    errors.title = 'global.required';
  }
  return errors;
};

export const ProposalAdminForm = React.createClass({
  propTypes: {
    proposalForm: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    themes: PropTypes.array.isRequired,
    features: PropTypes.object.isRequired,
  },

  render() {
    const { themes, features, user, proposalForm } = this.props;
    const optional = (
      <span className="excerpt">
        {' '}
        <FormattedMessage id="global.form.optional" />
      </span>
    );
    return (
      <form className="form-horizontal">
        <Field
          name="author"
          label="Auteur"
          id="proposal-admin-author"
          labelClassName="col-sm-2"
          inputClassName="col-sm-10"
          component={renderSelect}
          clearable={false}
          autoload
          loadOptions={() =>
            Promise.resolve({
              options: [{ label: user.displayName, value: user.id }],
            })
          }
        />
        <Field
          name="title"
          label="Titre"
          type="text"
          id="proposal-admin-title"
          autoComplete="off"
          labelClassName="col-sm-2"
          wrapperClassName="col-sm-10"
          component={renderInput}
        />
        <Field
          name="body"
          id="proposal-admin-body"
          type="editor"
          component={renderInput}
          label={<FormattedMessage id="proposal.body" />}
          labelClassName="col-sm-2"
          wrapperClassName="col-sm-10"
        />
        {proposalForm.usingCategories &&
          proposalForm.categories.length > 0 && (
            <Field
              name="category"
              id="proposal-admin-category"
              clearable={!proposalForm.categoryMandatory}
              label={
                <span>
                  {<FormattedMessage id="proposal.category" />}
                  {!proposalForm.categoryMandatory && optional}
                </span>
              }
              component={renderSelect}
              placeholder="proposal.select.category"
              options={proposalForm.categories.map(c => ({
                value: c.id,
                label: c.name,
              }))}
            />
          )}
        {features.themes &&
          proposalForm.usingThemes && (
            <Field
              name="theme"
              id="proposal-admin-theme"
              placeholder="proposal.select.theme"
              options={themes.map(t => ({ value: t.id, label: t.title }))}
              component={renderSelect}
              clearable={!proposalForm.themeMandatory}
              label={
                <span>
                  {<FormattedMessage id="proposal.theme" />}
                  {!proposalForm.themeMandatory && optional}
                </span>
              }
            />
          )}
        {features.districts &&
          proposalForm.usingDistrict && (
            <Field
              name="district"
              id="proposal-admin-district"
              placeholder="proposal.select.district"
              component={renderSelect}
              clearable={!proposalForm.districtMandatory}
              label={
                <span>
                  {<FormattedMessage id="proposal.district" />}
                  {!proposalForm.districtMandatory && optional}
                </span>
              }
              options={proposalForm.districts.map(d => ({ value: d.id, label: d.name }))}
            />
          )}
        {proposalForm.fields.map((field, index) => (
          <Field
            key={index}
            id={`proposal-admin-fields-${index}`}
            name={`responses[${index}].value`}
            type={field.type}
            component={renderInput}
            labelClassName="col-sm-2"
            wrapperClassName="col-sm-10"
            label={
              <span>
                {field.question}
                {!field.required && optional}
              </span>
            }
          />
        ))}
        <Field
          name="media"
          id="proposal-admin-media"
          type="image"
          component={renderInput}
          labelClassName="col-sm-2"
          wrapperClassName="col-sm-10"
          label={
            <span>
              {<FormattedMessage id="proposal.media" />}
              {optional}
            </span>
          }
        />
      </form>
    );
  },
});

export default connect((state, props) => ({
  initialValues: {
    project: formValueSelector(formName)(state, 'project'),
    author: state.user.user.id,
    responses: props.proposalForm.fields.map(field => ({ question: field.id })),
  },
  user: state.user.user,
  features: state.default.features,
  themes: state.default.themes,
}))(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    validate,
  })(ProposalAdminForm),
);
