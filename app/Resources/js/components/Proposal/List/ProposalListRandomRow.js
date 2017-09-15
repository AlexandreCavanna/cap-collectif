// @flow
import * as React from 'react';
import { Row, Col } from 'react-bootstrap';
import ProposalListOrderSorting from './ProposalListOrderSorting';
import ProposalListRandomMessage from './ProposalListRandomMessage';

type Props = { orderByVotes: boolean };

export class ProposalListRandomRow extends React.Component<Props> {
  render() {
    // eslint-disable-next-line react/prop-types
    const { orderByVotes } = this.props;
    return (
      <div>
        <Row>
          <Col xs={4} md={4}>
            <ProposalListOrderSorting orderByVotes={orderByVotes} />
          </Col>
          <Col xs={8} md={8}>
            <ProposalListRandomMessage />
          </Col>
        </Row>
      </div>
    );
  }
}

export default ProposalListRandomRow;
