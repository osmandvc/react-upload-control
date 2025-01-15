# React Upload Control

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, flexible, easy-to-use file upload solution for React applications. This monorepo contains the following packages:

## Packages

### [@osmandvc/react-upload-control](packages/core/README.md)

[![npm version](https://img.shields.io/npm/v/@osmandvc/react-upload-control.svg)](https://www.npmjs.com/package/@osmandvc/react-upload-control)

The lightweight core package providing essential hooks and providers for file upload management:

- Powerful file upload hooks and providers
- Built-in file ordering system
- State machine for upload lifecycle
- Zero dependencies (except optional toaster)

### [@osmandvc/react-upload-control-components](packages/components/README.md)

[![npm version](https://img.shields.io/npm/v/@osmandvc/react-upload-control-components.svg)](https://www.npmjs.com/package/@osmandvc/react-upload-control-components)

Pre-built UI components around the core package with a beautiful, modern design:

- Drag & Drop support
- Camera integration
- Clipboard support
- Tailwind-powered UI

## Quick Start

```bash
# Install the core package
npm install @osmandvc/react-upload-control

# Optional: Install the components package
npm install @osmandvc/react-upload-control-components
```

## Demo

Check out our interactive demo:  
[React Upload Control Demo](https://675c9582166050575d7b72e2-bzirycxazq.chromatic.com)

## Development

```bash
# Install dependencies
npm install

# Build packages
npm run build

# Run tests
npm run test

# Run Storybook
npm run storybook
```

## License

MIT [Osman Deveci](https://github.com/osmandvc)
