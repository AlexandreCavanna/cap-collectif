import React from 'react'
import { FormattedMessage } from 'react-intl'
import classNames from 'classnames'
import { connect } from 'react-redux'
import type { State } from '../../types'

type Props = {
  author: Record<string, any>
  onClick: (...args: Array<any>) => any
  className: string
  style?: Record<string, any>
  id?: string
  user?: Record<string, any>
  ariaLabel?: string
}

class DeleteButton extends React.Component<Props> {
  static defaultProps = {
    author: null,
    className: '',
    style: null,
    id: 'delete-button',
    user: null,
  }

  isDeletable = () => this.isTheUserTheAuthor()

  isTheUserTheAuthor = () => {
    const { author, user } = this.props

    if (author === null || !user) {
      return false
    }

    return user.uniqueId === author.uniqueId
  }

  render() {
    const { className, id, onClick, style, ariaLabel } = this.props

    if (this.isDeletable()) {
      const classes = {
        btn: true,
        'btn-danger': true,
        'btn--outline': true,
      }
      classes[className] = true
      return (
        <button
          id={id}
          type="button"
          style={style}
          className={classNames(classes)}
          onClick={() => onClick()}
          aria-label={ariaLabel}
        >
          <i className="cap cap-bin-2" />
          <FormattedMessage id="global.delete" />
        </button>
      )
    }

    return null
  }
}

const mapStateToProps = (state: State) => ({
  user: state.user.user,
})

export default connect<any, any>(mapStateToProps)(DeleteButton)
