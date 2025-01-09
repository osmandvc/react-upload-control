import type { Preview } from "@storybook/react";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: [
          "Examples",
          [
            "Upload Control With Progress",
            "Small Upload Control",
            "Upload Control without Drag and Drop",
            "Upload Control with PDF Pre-Processing",
          ],
        ],
      },
    },
  },
};

export default preview;
