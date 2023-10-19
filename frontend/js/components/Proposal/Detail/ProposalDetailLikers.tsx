import * as React from 'react'
import { graphql, createFragmentContainer } from 'react-relay'
import { connect } from 'react-redux'
import type { IntlShape } from 'react-intl'
import { injectIntl } from 'react-intl'
import { openDetailLikersModal } from '../../../redux/modules/proposal'
import ProposalDetailLikersLabel from './ProposalDetailLikersLabel'
import ProposalDetailLikersModal from './ProposalDetailLikersModal'
import type { ProposalDetailLikers_proposal } from '~relay/ProposalDetailLikers_proposal.graphql'
import type { Dispatch, State } from '../../../types'

type Props = {
  proposal: ProposalDetailLikers_proposal
  componentClass: string
  showModal: boolean
  dispatch: Dispatch
  intl: IntlShape
  size?: string
  // Temporary "newDesign" property, for a fresher design with a loading placeholder
  newDesign?: boolean
}
export class ProposalDetailLikers extends React.Component<Props> {
  static defaultProps = {
    componentClass: 'a',
  }

  handleClick = (e: React.SyntheticEvent<HTMLButtonElement>) => {
    const { dispatch, proposal } = this.props
    e.preventDefault()
    dispatch(openDetailLikersModal(proposal.id))
  }

  render() {
    const { size, proposal, componentClass, showModal, intl, newDesign } = this.props

    if (proposal?.likers.length === 0) {
      return null
    }

    return (
      <React.Fragment>
        <ProposalDetailLikersLabel
          proposal={proposal}
          title={intl.formatMessage({
            id: 'list-of-favorites',
          })}
          componentClass={componentClass}
          onClick={this.handleClick}
          size={size}
          newDesign={newDesign || false}
        />
        <ProposalDetailLikersModal show={showModal} proposal={proposal} />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state: State, props: Props) => ({
  showModal: state.proposal.showDetailLikersModal && state.proposal.showDetailLikersModal === props.proposal.id,
})

// @ts-ignore
const container = connect<any, any>(mapStateToProps)(injectIntl(ProposalDetailLikers))
export default createFragmentContainer(container, {
  proposal: graphql`
    fragment ProposalDetailLikers_proposal on Proposal {
      id
      likers {
        id
      }
      ...ProposalDetailLikersLabel_proposal
      ...ProposalDetailLikersModal_proposal
    }
  `,
})
