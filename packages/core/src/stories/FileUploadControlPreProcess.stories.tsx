import { Meta, StoryObj } from "@storybook/react";

import FileUploadControlPreProcess from "./FileUploadControlPreProcess";

const meta: Meta = {
  title: "Examples/Upload Control with PDF Pre-Processing",
  component: FileUploadControlPreProcess,
  parameters: {},
};
export default meta;

type Story = StoryObj<typeof FileUploadControlPreProcess>;

export const Default: Story = {
  args: {},
};
