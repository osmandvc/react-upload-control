import type { Preview } from "@storybook/react";
import "../src/styles/tailwind.css";
import "react-medium-image-zoom/dist/styles.css";

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
