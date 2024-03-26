import React from 'react'
import { Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { changeTerm } from '../../../redux/modules/project'
import Input from '../../Form/ReactBootstrapInput'
import type { Dispatch } from '../../../types'

type Props = {
  dispatch: Dispatch
}
type State = {
  termInputValue: string
  value?: string
}

class ProjectListSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      termInputValue: '',
    }
  }

  handleSubmit = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { dispatch } = this.props
    const { termInputValue } = this.state
    e.preventDefault()
    const value = termInputValue.length > 0 ? termInputValue : null
    dispatch(changeTerm(value))
  }

  handleChangeTermInput = (e: React.SyntheticEvent<HTMLInputElement>) => {
    this.setState({
      termInputValue: e.target.value,
    })
  }

  render() {
    const { value } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <Input
          id="project-search-input"
          type="text"
          placeholder="global.menu.search"
          buttonAfter={
            <Button id="project-search-button" type="submit">
              <i className="cap cap-magnifier" />
            </Button>
          }
          groupClassName="project-search-group pull-right w-100"
          value={value}
          onChange={this.handleChangeTermInput}
        />
      </form>
    )
  }
}

export default connect()(ProjectListSearch)
