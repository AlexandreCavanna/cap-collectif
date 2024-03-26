import React from 'react'
import { connect } from 'react-redux'
import { Row, Col, Button } from 'react-bootstrap'
import { Field, FieldArray, reduxForm, isSubmitting } from 'redux-form'
import renderInput from '../Form/Field'
import { setRegistrationEmailDomains as onSubmit } from '../../redux/modules/user'
import type { State } from '../../types'

const renderDomains = ({
  fields,
}: {
  fields: {
    push: (...args: Array<any>) => any
    map: (...args: Array<any>) => any
    remove: (...args: Array<any>) => any
  }
}): any => (
  <div>
    {fields.map((member, index) => (
      <Row key={index}>
        <Col xs={10}>
          <Field name={`${member}.value`} type="text" component={renderInput} />
        </Col>
        <Col xs={2}>
          <Button onClick={() => fields.remove(index)}>Supprimer</Button>
        </Col>
      </Row>
    ))}
    <Button
      style={{
        marginBottom: 10,
      }}
      onClick={() => fields.push({})}
    >
      Ajouter
    </Button>
  </div>
)

type Props = {
  handleSubmit: (...args: Array<any>) => any
  submitting: boolean
}
export const RegistrationEmailDomainsForm = ({ handleSubmit, submitting }: Props) => (
  <div>
    <p
      style={{
        marginTop: 10,
      }}
    >
      <strong>Nom(s) de domaine</strong>
    </p>
    <form onSubmit={handleSubmit}>
      <FieldArray name="domains" component={renderDomains} />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Chargement...' : 'Enregistrer'}
      </Button>
    </form>
  </div>
)

const mapStateToProps = (state: State) => ({
  submitting: isSubmitting('registration-email-domains')(state),
  initialValues: {
    domains: state.user.registration_form.domains,
  },
})

const connector = connect(mapStateToProps)
export default connector(
  reduxForm({
    form: 'registration-email-domains',
    onSubmit,
  })(RegistrationEmailDomainsForm),
)
