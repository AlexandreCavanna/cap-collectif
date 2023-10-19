import * as React from 'react'
import { FormattedMessage } from 'react-intl'
import { createFragmentContainer, graphql } from 'react-relay'
import type { StyledComponent } from 'styled-components'
import styled from 'styled-components'
import { connect } from 'react-redux'
import AddButton from '~/components/Ui/Button/AddButton'
import ProjectDistrictForm from './ProjectDistrictForm'
import ProjectDistrictAdminList from './ProjectDistrictAdminList'
import LanguageButtonContainer from '~/components/LanguageButton/LanguageButtonContainer'
import DeleteProjectDistrictMutation from '~/mutations/DeleteProjectDistrictMutation'
import type { ProjectDistrictAdminPage_districts } from '~relay/ProjectDistrictAdminPage_districts.graphql'

type Props = {
  districts: ProjectDistrictAdminPage_districts
}
type State = {
  isModalOpen: boolean
  isCreating: boolean
  editDistrictId: string | null | undefined
}
const PageTitleContainer: StyledComponent<any, {}, HTMLDivElement> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
export class ProjectDistrictAdminPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isModalOpen: false,
      isCreating: true,
      editDistrictId: null,
    }
  }

  openModal = () => {
    this.setState({
      isModalOpen: true,
      editDistrictId: null,
    })
  }

  closeModal = () => {
    this.setState({
      isModalOpen: false,
      isCreating: true,
      editDistrictId: null,
    })
  }

  handleCreate = () => {
    this.setState({
      isModalOpen: true,
      isCreating: true,
      editDistrictId: null,
    })
  }

  handleDelete = (deleteId: string) => {
    const input = {
      id: deleteId,
    }
    DeleteProjectDistrictMutation.commit({
      input,
    })
  }

  handleEdit = (editedId: string) => {
    this.setState({
      isCreating: false,
      isModalOpen: true,
      editDistrictId: editedId,
    })
  }

  render() {
    const { isModalOpen, isCreating, editDistrictId } = this.state
    const { districts } = this.props
    return (
      <div className="box box-primary container-fluid pb-15">
        <PageTitleContainer>
          <h3 className="box-title">
            <FormattedMessage id="proposal_form.districts" />
          </h3>
          <span className="mr-30 mt-15">
            <LanguageButtonContainer />
          </span>
        </PageTitleContainer>
        <hr />
        <ProjectDistrictForm
          member="projectDistrict"
          show={isModalOpen}
          isCreating={isCreating}
          handleClose={this.closeModal}
          district={
            districts.edges &&
            districts.edges
              .filter(Boolean)
              .map(edge => edge.node)
              .filter(Boolean)
              .find(district => district.id === editDistrictId)
          }
        />
        <ProjectDistrictAdminList districts={districts} handleDelete={this.handleDelete} handleEdit={this.handleEdit} />
        <AddButton onClick={this.handleCreate} />
      </div>
    )
  }
}
export default connect<any, any>()(
  createFragmentContainer(ProjectDistrictAdminPage, {
    districts: graphql`
      fragment ProjectDistrictAdminPage_districts on ProjectDistrictConnection {
        edges {
          node {
            id
            ...ProjectDistrictForm_district
          }
        }
        ...ProjectDistrictAdminList_districts
      }
    `,
  }),
)
