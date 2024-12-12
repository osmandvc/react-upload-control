import { Meta, StoryObj } from "@storybook/react";

import FileUploadControlSimple from "./FileUploadControlSimple";

const meta: Meta = {
  title: "Examples/Mini Upload Control",
  component: FileUploadControlSimple,
  parameters: {
    layout: "centered",
  },
};
export default meta;

type Story = StoryObj<typeof FileUploadControlSimple>;

//👇 Throws a type error it the args don't match the component props
export const Default: Story = {
  args: {},
};
