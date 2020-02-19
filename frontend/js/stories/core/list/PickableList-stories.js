// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import PickableList, { usePickableList } from '~ui/List/PickableList';

const items = [
  {
    id: 'item1',
    title: 'Je suis un bel item #1',
  },
  {
    id: 'item2',
    title: 'Je suis un bel item #2',
  },
  {
    id: 'item3',
    title: 'Je suis un bel item #3',
  },
  {
    id: 'item4',
    title: 'Je suis un bel item #4',
  },
  {
    id: 'item5',
    title: 'Je suis un bel item #5',
  },
];

const PickableListHeaderContent = () => {
  const { selectedRows, rowsCount } = usePickableList();

  const hasOneSelectedRow = selectedRows.length === 1;
  return selectedRows.length > 0 ? (
    <React.Fragment>
      <p>
        {selectedRows.length} élement{!hasOneSelectedRow && 's'} séléctionné
        {!hasOneSelectedRow && 's'}
      </p>
      <p>Action 1 quand select</p>
      <p>Action 2 quand select</p>
      <p>Action 3 quand select</p>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <p>{rowsCount} élements</p>
      <p>Action 1</p>
      <p>Action 2</p>
      <p>Action 3</p>
      <p>Action 4</p>
      <p>Action 5</p>
    </React.Fragment>
  );
};

const PickableListOutputExample = () => {
  const context = usePickableList();
  return <pre>{JSON.stringify(context, null, 2)}</pre>;
};

storiesOf('Core|List/PickableList', module)
  .add(
    'default',
    () => {
      return (
        <div>
          <PickableList>
            <PickableList.Header>
              <p>{items.length} élements</p>
              <p>Action 1</p>
              <p>Action 2</p>
              <p>Action 3</p>
              <p>Action 4</p>
              <p>Action 5</p>
            </PickableList.Header>
            <PickableList.Body>
              {items.map(proposal => (
                <PickableList.Row key={proposal.id} rowId={proposal.id}>
                  {proposal.title}
                </PickableList.Row>
              ))}
            </PickableList.Body>
          </PickableList>
          <hr />
          <h3>Context output for Pickable List</h3>
          <PickableListOutputExample />
        </div>
      );
    },
    {
      decorators: [storyFn => <PickableList.Provider>{storyFn()}</PickableList.Provider>],
    },
  )
  .add(
    'with selectionnable actions',
    () => {
      return (
        <div>
          <PickableList>
            <PickableList.Header>
              <PickableListHeaderContent />
            </PickableList.Header>
            <PickableList.Body>
              {items.map(proposal => (
                <PickableList.Row key={proposal.id} rowId={proposal.id}>
                  {proposal.title}
                </PickableList.Row>
              ))}
            </PickableList.Body>
          </PickableList>
          <hr />
          <h3>Context output for Pickable List</h3>
          <PickableListOutputExample />
        </div>
      );
    },
    {
      decorators: [storyFn => <PickableList.Provider>{storyFn()}</PickableList.Provider>],
    },
  )
  .add(
    'without header',
    () => {
      return (
        <div>
          <PickableList>
            <PickableList.Body>
              {items.map(proposal => (
                <PickableList.Row key={proposal.id} rowId={proposal.id}>
                  {proposal.title}
                </PickableList.Row>
              ))}
            </PickableList.Body>
          </PickableList>
          <hr />
          <h3>Context output for Pickable List</h3>
          <PickableListOutputExample />
        </div>
      );
    },
    {
      decorators: [storyFn => <PickableList.Provider>{storyFn()}</PickableList.Provider>],
    },
  );
