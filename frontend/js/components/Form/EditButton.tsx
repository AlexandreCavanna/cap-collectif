import React from 'react'
import classNames from 'classnames'
import { connect } from 'react-redux'
import { FormattedMessage } from 'react-intl'
import type { State } from '~/types'

type Props = {
  author: Record<string, any>
  label?: string
  onClick: (...args: Array<any>) => any
  className: string
  style?: Record<string, any>
  editable?: boolean
  id?: string
  user?: Record<string, any>
}

class EditButton extends React.Component<Props> {
  static defaultProps = {
    author: null,
    className: '',
    style: null,
    editable: true,
    id: 'edit-button',
    user: null,
  }

  isEditable = () => {
    const { editable } = this.props
    return editable && this.isTheUserTheAuthor()
  }

  isTheUserTheAuthor = () => {
    const { author, user } = this.props

    if (author === null || !user) {
      return false
    }

    return user.uniqueId === author.uniqueId
  }

  render() {
    const { className, id, onClick, style, label } = this.props

    if (this.isEditable()) {
      const classes = {
        btn: true,
        'btn-dark-gray': true,
        'btn--outline': true,
      }
      return (
        <button
          id={id}
          style={style}
          type="button"
          className={classNames(classes, className)}
          onClick={() => onClick()}
        >
          <i className="cap cap-pencil-1" />
          <FormattedMessage id={label ?? 'global.edit'} />
        </button>
      )
    }

    return null
  }
}

const mapStateToProps = (state: State) => ({
  user: state.user.user,
})

export default connect<any, any>(mapStateToProps)(EditButton)
