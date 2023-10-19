import * as React from 'react'
import { createFragmentContainer, graphql } from 'react-relay'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import ColorHash from 'color-hash'
import { Bar, BarChart, ResponsiveContainer, LabelList, XAxis, YAxis, Cell } from 'recharts'
import styled from 'styled-components'
import type { StyledComponent } from 'styled-components'
import type { QuestionnaireAdminResultsBarChart_multipleChoiceQuestion } from '~relay/QuestionnaireAdminResultsBarChart_multipleChoiceQuestion.graphql'
import { cleanMultipleChoiceQuestion } from '~/utils/cleanMultipleChoiceQuestion'

const hash = new ColorHash()
type Props = {
  multipleChoiceQuestion: QuestionnaireAdminResultsBarChart_multipleChoiceQuestion
  backgroundColor: string
  intl: IntlShape
  innerRef: (ref: any) => void
}
type DataType = {
  name: string
  value: number
}
const Container: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  width: 768px;
`
export class QuestionnaireAdminResultsBarChart extends React.Component<Props> {
  getYAxisWidth = (data: DataType[]): number => {
    const allNameLengthData = data.map(d => d.name.length)
    const maxLength = Math.max(...allNameLengthData)

    if (allNameLengthData.length > 0 && maxLength > 50) {
      return maxLength * 2.2
    }

    return 130
  }

  render() {
    const { multipleChoiceQuestion, backgroundColor, intl, innerRef } = this.props
    const data = cleanMultipleChoiceQuestion(multipleChoiceQuestion, intl)
    const containerHeight = data.length * 75
    return (
      <Container>
        <ResponsiveContainer height={containerHeight} ref={innerRef}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 15,
              right: 5,
              bottom: 15,
              left: 5,
            }}
          >
            <XAxis type="number" allowDecimals={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tickLine={false} width={this.getYAxisWidth(data)} />{' '}
            <Bar dataKey="value" maxBarSize={30} fill={backgroundColor}>
              {data.map((answer, idx) => (
                <Cell fill={hash.hex(answer.name?.trim() || '')} key={idx} />
              ))}
              <LabelList dataKey="value" position="right" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Container>
    )
  }
}
const container = injectIntl(QuestionnaireAdminResultsBarChart)
export default createFragmentContainer(container, {
  multipleChoiceQuestion: graphql`
    fragment QuestionnaireAdminResultsBarChart_multipleChoiceQuestion on MultipleChoiceQuestion {
      choices(allowRandomize: false) {
        edges {
          node {
            title
            responses {
              totalCount
            }
          }
        }
      }
      isOtherAllowed
      otherResponses {
        totalCount
      }
    }
  `,
})
