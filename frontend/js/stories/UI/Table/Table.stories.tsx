// @ts-nocheck
import * as React from 'react'
import type { TableProps } from '~ds/Table'
import Table from '~ds/Table'
import ButtonGroup from '~ds/ButtonGroup/ButtonGroup'
import Link from '~ds/Link/Link'
import Button from '~ds/Button/Button'
import Menu from '../../../components/DesignSystem/Menu/Menu'
import { ICON_NAME } from '~ds/Icon/Icon'
import Text from '~ui/Primitives/Text'
import ButtonQuickAction from '~ds/ButtonQuickAction/ButtonQuickAction'
import type { TablePlaceholderProps } from '~ds/Table/placeholder'
import TablePlaceholder from '~ds/Table/placeholder'
import { toast } from '~ds/Toast'

export default {
  title: 'Design system/Table',
  component: Table,
  argTypes: {
    selectable: {
      control: {
        type: 'boolean',
        required: false,
      },
      description: 'allow to select row',
      defaultValue: false,
    },
    actionBar: {
      control: {
        type: null,
        required: false,
      },
      description: 'render of action bar',
    },
    children: {
      control: {
        type: null,
        required: true,
      },
    },
  },
}

const Template = (args: TableProps) => (
  <Table {...args}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Fruit</Table.Th>
        <Table.Th>Job</Table.Th>
        <Table.Th>Country</Table.Th>
        <Table.Th isNumeric>Number</Table.Th>
        <Table.Th>
          {({ styles }) => (
            <Menu>
              <Menu.Button>
                <Button rightIcon={ICON_NAME.ARROW_DOWN_O} {...styles}>
                  Publication
                </Button>
              </Menu.Button>
              <Menu.List>
                <Menu.ListItem>
                  <Text>Recent</Text>
                </Menu.ListItem>
                <Menu.ListItem>
                  <Text>Older</Text>
                </Menu.ListItem>
              </Menu.List>
            </Menu>
          )}
        </Table.Th>
        <Table.Th>Description</Table.Th>
        <Table.Th>Gender</Table.Th>
        <Table.Th>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>

    <Table.Tbody>
      <Table.Tr rowId="123" checkboxLabel="Apple">
        <Table.Td>
          <Link href="https://apple.com">Apple</Link>
        </Table.Td>
        <Table.Td>Developer</Table.Td>
        <Table.Td>France</Table.Td>
        <Table.Td isNumeric>123456789</Table.Td>
        <Table.Td>12/01/2030</Table.Td>
        <Table.Td>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad atque, consectetur cumque eaque eum
          exercitationem in laudantium, minus modi odit optio quae quibusdam, quidem quis ratione rem suscipit
          voluptatum?
        </Table.Td>
        <Table.Td>M</Table.Td>
        <Table.Td visibleOnHover>
          <ButtonGroup>
            <ButtonQuickAction icon="PENCIL" label="edit" variantColor="primary" />
            <ButtonQuickAction icon="TRASH" label="delete" variantColor="danger" />
          </ButtonGroup>
        </Table.Td>
      </Table.Tr>

      <Table.Tr rowId="456" checkboxLabel="Banana">
        <Table.Td>
          <Link href="https://banana.com">Banana</Link>
        </Table.Td>
        <Table.Td>Engineer</Table.Td>
        <Table.Td>China</Table.Td>
        <Table.Td isNumeric>456789123.45</Table.Td>
        <Table.Td>11/01/2030</Table.Td>
        <Table.Td>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad atque, consectetur cumque eaque eum
          exercitationem in laudantium, minus modi odit optio quae quibusdam, quidem quis ratione rem suscipit
          voluptatum?
        </Table.Td>
        <Table.Td>{null}</Table.Td>
        <Table.Td visibleOnHover>
          <ButtonGroup>
            <ButtonQuickAction icon="PENCIL" label="edit" variantColor="primary" />
            <ButtonQuickAction icon="TRASH" label="delete" variantColor="danger" />
          </ButtonGroup>
        </Table.Td>
      </Table.Tr>

      <Table.Tr rowId="789" checkboxLabel="Strawberry">
        <Table.Td>
          <Link href="https://strawberry.com">Strawberry</Link>
        </Table.Td>
        <Table.Td>CEO</Table.Td>
        <Table.Td>Russia</Table.Td>
        <Table.Td isNumeric>789123456</Table.Td>
        <Table.Td>10/01/2030</Table.Td>
        <Table.Td>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusamus ad atque, consectetur cumque eaque eum
          exercitationem in laudantium, minus modi odit optio quae quibusdam, quidem quis ratione rem suscipit
          voluptatum?
        </Table.Td>
        <Table.Td>F</Table.Td>
        <Table.Td visibleOnHover>
          <ButtonGroup>
            <ButtonQuickAction icon="PENCIL" label="edit" variantColor="primary" />
            <ButtonQuickAction icon="TRASH" label="delete" variantColor="danger" />
          </ButtonGroup>
        </Table.Td>
      </Table.Tr>
    </Table.Tbody>
  </Table>
)

export const main = Template.bind({})
main.args = {}
main.storyName = 'Default'
export const Selectable = Template.bind({})
Selectable.args = {
  selectable: true,
  actionBar: (
    <ButtonGroup>
      <Button variant="secondary" variantColor="primary" variantSize="small">
        Add
      </Button>
      <Button variant="secondary" variantColor="danger" variantSize="small">
        Delete
      </Button>
    </ButtonGroup>
  ),
}
Selectable.storyName = 'selectable'

const TemplatePlaceholder = (args: TablePlaceholderProps) => <TablePlaceholder {...args} />

export const Placeholder = TemplatePlaceholder.bind({})
Placeholder.args = {
  rowsCount: 5,
  columnsCount: 5,
  selectable: true,
}
Placeholder.storyName = 'loading'

const TemplateEmpty = (args: TableProps) => (
  <Table {...args}>
    <Table.Thead>
      <Table.Tr>
        <Table.Th>Fruit</Table.Th>
        <Table.Th>Job</Table.Th>
        <Table.Th>Country</Table.Th>
        <Table.Th isNumeric>Number</Table.Th>
        <Table.Th>
          {({ styles }) => (
            <Menu>
              <Menu.Button as={React.Fragment}>
                <Button rightIcon={ICON_NAME.ARROW_DOWN_O} {...styles}>
                  Publication
                </Button>
              </Menu.Button>
              <Menu.List>
                <Menu.ListItem>
                  <Text>Recent</Text>
                </Menu.ListItem>
                <Menu.ListItem>
                  <Text>Older</Text>
                </Menu.ListItem>
              </Menu.List>
            </Menu>
          )}
        </Table.Th>
        <Table.Th>Description</Table.Th>
        <Table.Th>Gender</Table.Th>
        <Table.Th>Action</Table.Th>
      </Table.Tr>
    </Table.Thead>

    <Table.Tbody>{null}</Table.Tbody>
  </Table>
)

export const Empty = TemplateEmpty.bind({})
Empty.args = {
  onReset: () => {
    toast({
      variant: 'success',
      content: 'Reset',
    })
  },
}
