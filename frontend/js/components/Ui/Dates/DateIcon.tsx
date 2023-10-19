import * as React from 'react'
import { FormattedDate } from 'react-intl'
import moment from 'moment'

type Props = {
  startAt: (Date | null | undefined) | (string | null | undefined)
}
export class DateIcon extends React.Component<Props> {
  render() {
    const { startAt } = this.props
    const date = moment(startAt)
    return (
      <div className="event__icon center-block">
        <div className="day calendar-icon__day">
          <FormattedDate value={date} day="2-digit" />
        </div>
        <div className="month calendar-icon__month">
          <FormattedDate value={date} month="short" />
        </div>
      </div>
    )
  }
}
export default DateIcon
