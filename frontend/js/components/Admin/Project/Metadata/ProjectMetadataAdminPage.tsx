import React from 'react'
import { connect } from 'react-redux'
import type { IntlShape } from 'react-intl'
import { injectIntl, FormattedMessage } from 'react-intl'
import { createFragmentContainer, graphql } from 'react-relay'
import ProjectMetadataAdminForm from '~/components/Admin/Project/Metadata/ProjectMetadataAdminForm'
import type { ProjectMetadataAdminPage_project } from '~relay/ProjectMetadataAdminPage_project.graphql'
import '~relay/ProjectMetadataAdminPage_project.graphql'

type Props = ReduxFormFormProps & {
  project: ProjectMetadataAdminPage_project | null | undefined
  formName: string
  intl: IntlShape
}
export const ProjectMetadataAdminPage = (props: Props) => (
  <div className="col-md-6">
    <div className="box box-primary container-fluid">
      <div className="box-header">
        <h4 className="box-title">
          <FormattedMessage id="admin.fields.project.group_meta" />
        </h4>
      </div>
      <div className="box-content">
        <ProjectMetadataAdminForm {...props} />
      </div>
    </div>
  </div>
)
export default createFragmentContainer(injectIntl(connect<any, any>()(ProjectMetadataAdminPage)), {
  project: graphql`
    fragment ProjectMetadataAdminPage_project on Project {
      id
      ...ProjectMetadataAdminForm_project
    }
  `,
})
