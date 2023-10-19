// @ts-nocheck
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'

const EngagementItemContainer: StyledComponent<
  {
    color?: string
  },
  {},
  HTMLDivElement
> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    width: 50px;
    height: 50px;
    margin-bottom: 12px;
  }
`
export default EngagementItemContainer
