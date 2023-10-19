/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { ProposalTrashedListPaginated } from './ProposalTrashedListPaginated'
import { relayPaginationMock, $refType, $fragmentRefs } from '~/mocks'

describe('<ProposalTrashedListPaginated />', () => {
  const props = {
    relay: { ...relayPaginationMock, hasMore: () => true },
    project: {
      ' $refType': $refType,
      id: 'UHJvamVjdDpwcm9qZWN0MQ==',
      proposals: {
        totalCount: 3,
        edges: [
          {
            node: {
              id: 'proposal1',
              ' $fragmentRefs': $fragmentRefs,
            },
          },
          {
            node: {
              id: 'proposal2',
              ' $fragmentRefs': $fragmentRefs,
            },
          },
          {
            node: {
              id: 'proposal3',
              ' $fragmentRefs': $fragmentRefs,
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
          hasPreviousPage: false,
          startCursor: null,
          endCursor: null,
        },
      },
      firstCollectStep: {
        form: {
          objectType: 'PROPOSAL',
        },
      },
    },
  }
  it('render null', () => {
    const wrapper = shallow(
      <ProposalTrashedListPaginated
        relay={relayPaginationMock}
        project={{
          ' $refType': $refType,
          id: 'project1',
          proposals: {
            totalCount: 0,
            edges: [],
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null,
            },
          },
          firstCollectStep: {
            form: {
              objectType: 'PROPOSAL',
            },
          },
        }}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should render correctly', () => {
    const wrapper = shallow(<ProposalTrashedListPaginated {...props} />)
    expect(wrapper).toMatchSnapshot()
    wrapper.find('#ProposalTrashedListPaginated-loadMore').simulate('click')
    expect(wrapper).toMatchSnapshot()
    expect(props.relay.loadMore).toMatchSnapshot()
  })
})
