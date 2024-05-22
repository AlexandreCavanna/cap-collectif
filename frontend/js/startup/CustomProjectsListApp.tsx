// @ts-nocheck
import React, { lazy, Suspense } from 'react'
import Providers from './Providers'
import Loader from '~ui/FeedbacksIndicators/Loader'
const CustomProjectList = lazy(
  () =>
    import(
      /* webpackChunkName: "CustomProjectList" */
      '~/components/Project/List/CustomProjectList'
    ),
)
type Props = {
  readonly projectsCount: number
}
export default (props: Props) => {
  return (
    <Suspense fallback={<Loader />}>
      <Providers designSystem>
        <CustomProjectList {...props} />
      </Providers>
    </Suspense>
  )
}
