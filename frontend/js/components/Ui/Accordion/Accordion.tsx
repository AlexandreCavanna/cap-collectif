import React, { useState } from 'react'
import { Panel, Accordion as BsAccordion } from 'react-bootstrap'

import styled from 'styled-components'

type Input = {
  key: string
  title: string
  content: string
}
type Props = {
  openedColor: string
  closedColor: string
  titleColor: string
  defaultActiveKey?: string
  inputs: Array<Input>
}
export const PanelContainer = styled(Panel)<{
  active: boolean
}>`
  border-radius: 0 !important;
  margin: ${props => (props.active ? '-1px !important' : '0 !important')};
  border-top-color: ${props => (props.active ? '#fff' : '')};
  font-size: unset;
`
export const PanelHeader = styled(Panel.Heading)<{
  inputColor: string
  titleColor: string
}>`
  text-align: center;
  background-color: ${props => `${props.inputColor} !important` || ''};
  border-radius: 0;
  padding: 30px !important;
  color: ${props => `${props.titleColor} !important` || ''};
`
export const PanelBody = styled(Panel.Body)`
  padding: 30px !important;
`
export const Accordion = ({ defaultActiveKey, inputs, openedColor, closedColor, titleColor }: Props) => {
  const [activeKey, changeActiveKey] = useState(defaultActiveKey)
  return (
    <BsAccordion accordion activeKey={activeKey} onSelect={changeActiveKey}>
      {inputs?.length !== 0 &&
        inputs.map((input, idx) => (
          <PanelContainer
            key={idx}
            eventKey={input.key}
            onClick={() => changeActiveKey(input.key)}
            active={input.key === activeKey}
          >
            <PanelHeader inputColor={input.key === activeKey ? openedColor : closedColor} titleColor={titleColor}>
              <Panel.Title className="accordion-title">{input.title}</Panel.Title>
            </PanelHeader>
            <PanelBody collapsible>
              <div
                dangerouslySetInnerHTML={{
                  __html: input.content,
                }}
              />
            </PanelBody>
          </PanelContainer>
        ))}
    </BsAccordion>
  )
}
export default Accordion
