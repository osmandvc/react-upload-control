import { Meta, StoryObj } from "@storybook/react";
import FileUploadControlTestError from "./FileUploadControlTestError";

const meta: Meta = {
  title: "FileUploadControlTestError",
  component: FileUploadControlTestError,
};
export default meta;

type Story = StoryObj<typeof FileUploadControlTestError>;

//👇 Throws a type error it the args don't match the component props
export const Default: Story = {
  args: {},
};
