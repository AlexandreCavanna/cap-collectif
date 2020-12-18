// @flow
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { useDisclosure } from '@liinkiing/react-hooks';
import DetailDrawer from '~ds/DetailDrawer/DetailDrawer';
import Flex from '~ui/Primitives/Layout/Flex';
import Button from '~ds/Button/Button';
import Text from '~ui/Primitives/Text';
import Menu from '~ds/Menu/Menu';

storiesOf('Design system|DetailDrawer', module).add('default', () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex>
      <Button variant="link" onClick={onOpen}>
        Plus de détail
      </Button>
      <DetailDrawer isOpen={isOpen} onClose={onClose}>
        <DetailDrawer.Header textAlign="center" justifyContent="space-between">
          <Text fontWeight="bold">John Doe</Text>
          <Menu>
            <Menu.Button as={React.Fragment}>
              <Button variant="tertiary">Actions</Button>
            </Menu.Button>
            <Menu.List>
              <Menu.ListItem>Signaler</Menu.ListItem>
            </Menu.List>
          </Menu>
        </DetailDrawer.Header>
        <DetailDrawer.Body>
          <Text>Sur ma route oui, il y a eu du move</Text>
        </DetailDrawer.Body>
      </DetailDrawer>
    </Flex>
  );
});
