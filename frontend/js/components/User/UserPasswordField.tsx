import React from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form'
import component from '../Form/Field'
import UserPasswordComplexityUtils from './UserPasswordComplexityUtils'
import type { FeatureToggles, Dispatch, State } from '../../types'
type OwnProps = {
  readonly id: string
  readonly formName: string
  readonly name: string
  readonly divClassName?: string
  readonly ariaRequired?: boolean
  readonly autoComplete?: string
  readonly label?: any
  readonly labelClassName?: string
}
type Props = OwnProps & {
  readonly features: FeatureToggles
  readonly dispatch: Dispatch
}
type UserPasswordFieldState = {
  isPasswordFocus: boolean
}
export class UserPasswordField extends React.Component<Props, UserPasswordFieldState> {
  state = {
    isPasswordFocus: false,
  }
  setPasswordFocusToTrue = () => {
    this.setState({
      isPasswordFocus: true,
    })
  }
  setPasswordFocusToFalse = () => {
    this.setState({
      isPasswordFocus: false,
    })
  }

  render() {
    const { features, id, formName, name, divClassName, ariaRequired, autoComplete, label, labelClassName } = this.props
    const { isPasswordFocus } = this.state

    if (features.secure_password) {
      return (
        <UserPasswordComplexityUtils
          name={name}
          formName={formName}
          isPasswordFocus={isPasswordFocus}
          field={
            <Field
              type="password"
              component={component}
              onFocus={this.setPasswordFocusToTrue}
              onBlur={this.setPasswordFocusToFalse}
              name={name}
              id={id}
              divClassName={divClassName || ''}
              ariaRequired={ariaRequired}
              autoComplete={autoComplete}
              label={label || null}
              labelClassName={labelClassName || ''}
            />
          }
        />
      )
    }

    return (
      <Field
        type="password"
        component={component}
        onFocus={this.setPasswordFocusToTrue}
        onBlur={this.setPasswordFocusToFalse}
        name={name}
        id={id}
        divClassName={divClassName || ''}
        ariaRequired={ariaRequired}
        autoComplete={autoComplete}
        label={label || null}
        labelClassName={labelClassName || ''}
      />
    )
  }
}

const mapStateToProps = (state: State) => ({
  features: state.default.features,
})

export default connect<Props, OwnProps, _, _, _, _>(mapStateToProps)(UserPasswordField)
