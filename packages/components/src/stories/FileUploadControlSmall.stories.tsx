import { Meta, StoryObj } from "@storybook/react";

import FileUploadControlSmall from "./FileUploadControlSmall";

const meta: Meta = {
  title: "Examples/Small Upload Control",
  component: FileUploadControlSmall,
  parameters: {},
};
export default meta;

type Story = StoryObj<typeof FileUploadControlSmall>;

export const Default: Story = {
  args: {},
};
