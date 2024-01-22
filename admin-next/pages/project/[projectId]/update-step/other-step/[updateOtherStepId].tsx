import React from 'react'
import withPageAuthRequired from '@utils/withPageAuthRequired'
import { useRouter } from 'next/router'
import Layout from '@components/Layout/Layout'
import { CapUIIconSize, Flex, Spinner } from '@cap-collectif/ui'
import OtherStepForm from '@components/Steps/OtherStep/OtherStepForm'
import StepCreationSide from '@components/StepCreationSide/StepCreationSide'

const UpdateOtherStepWrapper = () => {
  const router = useRouter()
  const stepId = router.query.updateOtherStepId
  const [helpMessage, setHelpMessage] = React.useState<string | null>(null)

  if (!stepId) return null

  return (
    <Layout navTitle="">
      <Flex direction="row" width="100%" gap={6}>
        <React.Suspense
          fallback={
            <Flex alignItems="center" justifyContent="center">
              <Spinner size={CapUIIconSize.Xxl} color="gray.150" />
            </Flex>
          }
        >
          <OtherStepForm stepId={stepId as string} setHelpMessage={setHelpMessage} />
        </React.Suspense>
        <StepCreationSide helpMessage={helpMessage} />
      </Flex>
    </Layout>
  )
}

export const getServerSideProps = withPageAuthRequired

export default UpdateOtherStepWrapper
