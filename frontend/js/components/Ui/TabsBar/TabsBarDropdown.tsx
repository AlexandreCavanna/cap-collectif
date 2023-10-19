import * as React from 'react'
import { useMenuState, Menu, MenuButton, MenuItem, MenuSeparator } from 'reakit/Menu'
import * as S from './styles'
import useIsMobile from '~/utils/hooks/useIsMobile'
import type { Item } from '~/components/Navbar/Navbar.type'
type Props = {
  readonly item: Item
}

const renderChildren = (children, menu): JSX.Element => {
  const isSeeMore = children.some(child => child.children?.length > 0)
  return children.map((child, childIndex) => (
    <React.Fragment key={child.id}>
      {childIndex > 0 && isSeeMore && <MenuSeparator {...menu} as={S.Separator} />}

      <MenuItem
        {...menu}
        as={child.link ? S.TabsLink : S.TabsParent}
        href={child.link ? child.link : undefined}
        active={child.active}
        key={childIndex}
      >
        {child.title}
      </MenuItem>

      {child.children?.length > 0 &&
        child.children.map(subChild => (
          <MenuItem
            {...menu}
            as={subChild.link ? S.TabsLink : S.TabsParent}
            href={subChild.link ? subChild.link : undefined}
            active={subChild.active}
            key={subChild.id}
          >
            {subChild.title}
          </MenuItem>
        ))}
    </React.Fragment>
  ))
}

const TabsBarDropdown = ({ item }: Props): JSX.Element => {
  const { id, title, children } = item
  const menu = useMenuState({
    baseId: id,
  })
  const isMobile = useIsMobile()
  return (
    <React.Fragment key={id}>
      <MenuButton {...menu} id={`tabsbar-item-${item.id}`} as={S.DropdownToggle} isOpen={menu.visible}>
        {title}

        <span className="caret" />
      </MenuButton>

      <Menu
        {...menu}
        unstable_popoverStyles={isMobile ? null : menu.unstable_popoverStyles}
        as={S.DropdownMenu}
        hideOnClickOutside
        aria-label={title}
        key={`menu-${id}`}
      >
        {renderChildren(children, menu)}
      </Menu>
    </React.Fragment>
  )
}

export default TabsBarDropdown
