import React from 'react'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import { FormControl } from 'react-bootstrap'
import { connect } from 'react-redux'
import { changeOrderBy } from '../../../../redux/modules/project'
import type { GlobalState, Dispatch } from '../../../../types'

type Props = {
  dispatch: Dispatch
  orderBy: string
  intl: IntlShape
}

class ProjectListFilterOrder extends React.Component<Props> {
  render() {
    const { dispatch, orderBy, intl } = this.props
    return (
      <FormControl
        id="project-sorting"
        componentClass="select"
        type="select"
        name="orderBy"
        value={orderBy}
        onChange={(e: React.SyntheticEvent<HTMLInputElement>) => {
          dispatch(changeOrderBy(e.target.value))
        }}
      >
        <option key="date" value="PUBLISHED_AT">
          {intl.formatMessage({
            id: 'opinion.sort.last',
          })}
        </option>
        <option key="popularity" value="POPULAR">
          {intl.formatMessage({
            id: 'argument.sort.popularity',
          })}
        </option>
      </FormControl>
    )
  }
}

const mapStateToProps = (state: GlobalState) => ({
  orderBy: state.project.orderBy || 'PUBLISHED_AT',
})

export default connect<any, any>(mapStateToProps)(injectIntl(ProjectListFilterOrder))
