import type { Meta, StoryObj } from '@storybook/react'
import { Table } from '@web-loom/foolscap-react'

const meta = {
  title: 'Tier 1/Table',
  component: Table,
  tags: ['autodocs'],
  args: {
    variant: 'striped',
  },
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Table {...args}>
      <thead>
        <tr>
          <th scope="col">Component</th>
          <th scope="col">Tier</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Alert</td>
          <td>1</td>
          <td>Ready</td>
        </tr>
        <tr>
          <td>Color Picker</td>
          <td>1</td>
          <td>Queued</td>
        </tr>
      </tbody>
    </Table>
  ),
}
