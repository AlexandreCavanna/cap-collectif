import type { StyledComponent } from 'styled-components'
import styled, { css } from 'styled-components'
import Flex from '~ui/Primitives/Layout/Flex'
import { mediaQueryMobile } from '~/utils/sizes'

type Theme = {
  mainNavbarText: string
  mainNavbarBg: string
  mainNavbarBgActive: string
  mainNavbarTextHover: string
}
export const TabsBarContainer = styled.ul<{
  show?: boolean
  vertical?: boolean
}>`
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  align-items: center;
  margin: 0;
  padding: 0;

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    flex-direction: column;
    align-items: flex-start;
    flex-wrap: nowrap;
  }
`
const activeNavItem = css`
  color: ${props => props.theme.mainNavbarTextActive};
  background-color: ${props => props.theme.mainNavbarBgActive};
`
export const TabsItemContainer = styled.li<{
  active?: boolean
}>`
  position: relative;
  display: block;
  width: auto;
  height: 100%;
  text-align: center;
  white-space: nowrap;
  list-style: none;
  cursor: pointer;
  ${props => props.active && activeNavItem}

  & > a, & > div[id*='tabs-navbar-parent'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    text-align: left;
    height: 100%;
    padding: 10px 15px;
  }

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    width: 100%;
  }
`
const activeTabsLinkMixin = css`
  color: ${props => props.theme.mainNavbarTextActive};
  background-color: ${props => props.theme.mainNavbarBgActive};
  text-decoration: none;
`
export const TabsLink = styled.a<{
  active?: boolean
  theme?: Theme
}>`
  color: ${props => props.theme && props.theme.mainNavbarText};
  text-decoration: none;
  text-align: left;
  ${props => props.active && activeTabsLinkMixin}

  &:hover,
  &:focus {
    color: ${props => props.theme.mainNavbarTextHover};
    background-color: ${props => props.theme.mainNavbarBgActive};
    text-decoration: none;
    outline: none;
  }
`
export const TabsParent = styled.div<{
  active?: boolean
  theme?: Theme
}>`
  color: ${props => props.theme && props.theme.mainNavbarText};
  text-decoration: none;
  text-align: left;
  width: 100%;
  padding: 3px 20px;
  cursor: default !important;
  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    padding: 10px 15px;
  }
`
export const TabsDivider: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  height: 1px;
  margin: 9px 0;
  overflow: hidden;
  background-color: #e5e5e5;
`
export const Separator: StyledComponent<any, {}, HTMLHRElement> = styled.hr`
  margin: 10px 0;
  border: 1px solid #e3e3e3;
  width: 100%;
`
export const DropdownToggle = styled(Flex).attrs({
  direction: 'row',
  align: 'center',
  height: '100%',
})<{
  isOpen: boolean
}>`
  .caret {
    margin-left: 5px;
  }
  padding: 8px 16px;

  ${props =>
    props.isOpen &&
    css`
      color: ${props.theme.mainNavbarTextHover};
      background-color: ${props.theme.mainNavbarBgActive};
    `}

  &:hover,
  &:focus {
    color: ${props => props.theme.mainNavbarTextHover};
    background-color: ${props => props.theme.mainNavbarBgActive};
  }
`
export const DropdownMenu: StyledComponent<any, {}, typeof Flex> = styled(Flex).attrs({
  direction: 'column',
  align: 'center',
  py: 1,
  boxShadow: 'rgb(0 0 0 / 18%) 0px 6px 12px',
  fontSize: '14px',
  overflow: 'hidden',
})`
  border-radius: 0 0 4px 4px;
  background-color: ${props => props.theme.mainNavbarBg};

  &:hover,
  &:focus {
    outline: none;
  }

  a {
    width: 100%;
    font-weight: 400;
    padding: 3px 20px;
  }

  @media (max-width: ${mediaQueryMobile.maxWidth}) {
    a {
      text-align: left;
    }
  }
`
