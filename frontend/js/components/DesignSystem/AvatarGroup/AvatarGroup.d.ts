// @ts-nocheck
import { PolymorphicComponent } from '../../Ui/Primitives/AppBox'
import type { AvatarSize } from '../Avatar/Avatar'

type Props = {
  readonly max?: number
  readonly size?: AvatarSize
  readonly showNames?: boolean
}

declare const AvatarGroup: PolymorphicComponent<Props>

export default AvatarGroup
