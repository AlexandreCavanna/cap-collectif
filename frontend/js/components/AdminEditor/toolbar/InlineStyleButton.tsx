// @ts-nocheck
import type { Node } from 'react'
import React, { useContext } from 'react'
import { RichUtils } from 'draft-js'
import FormatButton from './FormatButton'
import { EditorContext } from '../context'
import type { DraftInlineStyle } from '../models/types'
import '../models/types'

type Props = {
  styleName: DraftInlineStyle
  title: string
  shortcut?: string
  children: Node
}

function InlineStyleButton({ styleName, title, shortcut = '', children, ...rest }: Props) {
  // @ts-expect-error: context can be null but nevermind...
  const { editorState, handleChange } = useContext(EditorContext)

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    handleChange(RichUtils.toggleInlineStyle(editorState, styleName))
  }

  function isActive(): boolean {
    return editorState.getCurrentInlineStyle().has(styleName)
  }

  const label = `${title} ${shortcut && `(${shortcut})`}`
  return (
    <FormatButton active={isActive()} onClick={handleClick} tabIndex="-1" title={label} aria-label={label} {...rest}>
      {children}
    </FormatButton>
  )
}

export default InlineStyleButton
