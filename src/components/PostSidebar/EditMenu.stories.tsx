import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EditMenu } from './EditMenu';

/**
 * The sidebar header's Edit / "more" control (iOS Messages affordance) as a
 * shadcn Popover. Its one setting for now is the System / Light / Dark theme
 * toggle, which themes the whole app.
 */
const meta = {
    title: 'Blog/EditMenu',
    component: EditMenu,
    parameters: { layout: 'centered' },
    decorators: [
        (Story) => (
            <div className='flex min-h-[320px] w-[320px] items-start justify-end p-4'>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof EditMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resting — just the "•••" control. */
export const Closed: Story = {};

/** Opened — the popover with the Appearance (theme) toggle. */
export const Open: Story = {
    args: { defaultOpen: true },
};
