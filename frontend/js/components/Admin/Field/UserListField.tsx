import * as React from 'react'
import { fetchQuery_DEPRECATED, graphql } from 'react-relay'
import { Field } from 'redux-form'
import select from '../../Form/Select'
import environment from '../../../createRelayEnvironment'

type Props = {
  id?: string | null | undefined
  name: string
  label?: React.ReactElement<React.ComponentProps<any>, any>
  labelClassName?: string | null | undefined
  inputClassName?: string | null | undefined
  blockClassName?: string | null | undefined
  divClassName?: string | null | undefined
  placeholder?: string | null | undefined
  ariaControls?: string | null | undefined
  userListToNoSearch?: Array<string> | null | undefined
  disabled?: boolean
  selectFieldIsObject?: boolean
  multi?: boolean
  autoload?: boolean
  debounce?: boolean
  authorOfEvent?: boolean
  clearable?: boolean
  help?: React.ReactElement<React.ComponentProps<any>, any>
  noOptionsMessage?: string
}
const getUsersList = graphql`
  query UserListFieldQuery($displayName: String, $authorOfEventOnly: Boolean) {
    userSearch(displayName: $displayName, authorsOfEventOnly: $authorOfEventOnly) {
      id
      displayName
      email
    }
  }
`
const getUsersListWithoutIds = graphql`
  query UserListFieldNotInIdsQuery($notInIds: [String], $displayName: String, $authorOfEventOnly: Boolean) {
    userSearch(notInIds: $notInIds, displayName: $displayName, authorsOfEventOnly: $authorOfEventOnly) {
      id
      displayName
      email
    }
  }
`

const formatUsersData = users => {
  const duplicateNames = {}
  users.forEach(({ displayName }, index) => {
    if (duplicateNames[displayName]) {
      duplicateNames[displayName].push(index)
    } else {
      duplicateNames[displayName] = [index]
    }
  })
  return users.map(({ id, displayName, email }) => {
    let label = displayName

    if (duplicateNames[displayName] && duplicateNames[displayName].length > 1) {
      label = `${displayName} - ${email}`
    }

    return {
      value: id,
      label,
    }
  })
}

export default class UserListField extends React.Component<Props> {
  static defaultProps = {
    className: '',
    authorOfEvent: false,
    multi: false,
    debounce: false,
    placeholder: '',
  }

  loadOptions = (search: string) => {
    const { userListToNoSearch, authorOfEvent } = this.props

    const retrieveUsersList = (usersIds: Array<string> | null | undefined, terms: string | null | undefined) => {
      if (usersIds) {
        return fetchQuery_DEPRECATED(environment, getUsersListWithoutIds, {
          notInIds: usersIds,
          displayName: terms,
          authorOfEventOnly: authorOfEvent,
        }).then(data => formatUsersData(data.userSearch))
      }

      return fetchQuery_DEPRECATED(environment, getUsersList, {
        displayName: terms,
        authorOfEventOnly: authorOfEvent,
      }).then(data => formatUsersData(data.userSearch))
    }

    return retrieveUsersList(userListToNoSearch, search)
  }

  render() {
    const {
      id,
      name,
      label,
      labelClassName,
      inputClassName,
      divClassName,
      clearable,
      autoload,
      placeholder,
      ariaControls,
      disabled,
      selectFieldIsObject,
      debounce,
      multi,
      help,
      noOptionsMessage,
      blockClassName,
    } = this.props
    return (
      <Field
        name={name}
        id={id}
        label={label}
        divClassName={divClassName}
        labelClassName={labelClassName}
        inputClassName={inputClassName}
        blockClassName={blockClassName}
        placeholder={placeholder}
        aria-controls={ariaControls}
        multi={multi}
        aria-autocomplete="list"
        aria-haspopup="true"
        role="combobox"
        debounce={debounce}
        autoload={autoload}
        disabled={disabled}
        selectFieldIsObject={selectFieldIsObject}
        component={select}
        clearable={clearable}
        loadOptions={this.loadOptions}
        help={help}
        noOptionsMessage={noOptionsMessage}
      />
    )
  }
}
