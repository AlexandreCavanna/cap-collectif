// @ts-nocheck
import * as React from 'react'
import Providers from './Providers'
import type { Props } from '~/components/InteClient/ProposalPreview/ProposalPreviewList/ProposalPreviewList'
import ProposalPreviewList from '~/components/InteClient/ProposalPreview/ProposalPreviewList/ProposalPreviewList'

export default (props: Props) => (
  <Providers>
    <ProposalPreviewList {...props} />
  </Providers>
)
