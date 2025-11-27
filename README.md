# Map POIs Viewer

A React and TypeScript application for visualizing Points of Interest (POIs) within indoor environments. This project integrates the Situm JavaScript SDK to retrieve building information and POIs, displaying them on an interactive MapLibre map. Users can browse, search, and select POIs through a synchronized list and map interface.

## Table of Contents

- [Map POIs Viewer](#map-pois-viewer)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technology Stack](#technology-stack)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
    - [Development Server](#development-server)
    - [Production Build](#production-build)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
    - [Linting](#linting)
    - [Formatting](#formatting)
    - [Pre-commit Hooks](#pre-commit-hooks)
  - [Deployment](#deployment)

## Features

- Interactive map powered by MapLibre GL JS
- Building and POI data retrieval via the Situm SDK
- POI list with text-based search functionality
- Bidirectional synchronization between list selection and map markers
- Global state management with Zustand
- Modular architecture designed for extension and maintainability

## Technology Stack

| Category         | Technologies                        |
| ---------------- | ----------------------------------- |
| Framework        | React 19, TypeScript                |
| Build Tool       | Vite                                |
| Styling          | TailwindCSS                         |
| Mapping          | MapLibre GL JS                      |
| SDK              | Situm JS SDK (`@situm/sdk-js`)      |
| State Management | Zustand                             |
| Testing          | Vitest, Testing Library             |
| Code Quality     | ESLint, Prettier, Husky, Commitlint |

## Prerequisites

Ensure the following are installed on your system before proceeding:

- **Node.js** — version 22.21.1 or higher
- **Yarn** — version 1.22.22 or higher

To verify your installations, run:

```bash
node --version
yarn --version
```

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:Alessag/map-pois.git
   ```

2. Navigate to the project directory:

   ```bash
   cd map-pois
   ```

3. Install dependencies:

   ```bash
   yarn install
   ```

## Configuration

Copy the `.env.example` into a new `.env` file in the project root directory with the following variable:

```env
VITE_SITUM_API_KEY=your_api_key
```

Replace the placeholder value with your actual Situm credential.

## Usage

### Development Server

Start the local development server:

```bash
yarn dev
```

The application will be available at `http://localhost:5173`.

### Production Build

Generate a production-ready build:

```bash
yarn build
```

Preview the production build locally:

```bash
yarn preview
```

## Testing

Run the complete test suite:

```bash
yarn test
```

## Code Quality

This project enforces code quality through automated tooling.

### Linting

```bash
yarn lint
```

### Formatting

```bash
yarn format
```

### Pre-commit Hooks

The project uses Husky and lint-staged to automatically validate and format code before each commit. Commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification, enforced by Commitlint.

## Deployment

The build output is fully static and compatible with any static hosting provider, including Vercel, Netlify, Cloudflare Pages, and GitHub Pages.

To deploy:

1. Build the project:

   ```bash
   yarn build
   ```

2. Upload the contents of the `dist/` directory to your hosting provider.

3. Configure the required environment variables on your deployment platform.
