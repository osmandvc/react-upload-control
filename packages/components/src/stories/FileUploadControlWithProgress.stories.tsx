import type { Meta, StoryObj } from "@storybook/react";
import FileUploadControlWithProgress from "./FileUploadControlWithProgress";

const meta = {
  title: "Examples/Upload Control With Progress",
  component: FileUploadControlWithProgress,
  parameters: {},
} satisfies Meta<typeof FileUploadControlWithProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
