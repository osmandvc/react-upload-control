import type { Meta, StoryObj } from "@storybook/react";
import FileUploadControlWithProgress from "./FileUploadControlWithProgress";

const meta = {
  title: "Examples/With Progress",
  component: FileUploadControlWithProgress,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FileUploadControlWithProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
