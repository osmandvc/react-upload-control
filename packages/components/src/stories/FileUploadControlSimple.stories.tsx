import { Meta, StoryObj } from "@storybook/react";

import FileUploadControlSimple from "./FileUploadControlSimple";

const meta: Meta = {
  title: "Examples/Upload Control without Drag and Drop",
  component: FileUploadControlSimple,
  parameters: {},
};
export default meta;

type Story = StoryObj<typeof FileUploadControlSimple>;

export const Default: Story = {
  args: {},
};
