# Anchor Vue UI

> A modern Docker Desktop Management UI built with Vue.js 3 and Tailwind CSS

Anchor is a powerful, user-friendly web interface for managing Docker containers, images, volumes, and Kubernetes deployments. Built with Vue.js 3, Vite, and Tailwind CSS, it provides a clean and intuitive dashboard for Docker operations.

## Features

- 🐳 **Container Management**: View, start, stop, restart, and delete Docker containers
- 🖼️ **Image Management**: Browse, pull, and manage Docker images
- 💾 **Volume Management**: Manage Docker volumes
- ☸️ **Kubernetes Support**: Monitor and manage Kubernetes deployments
- 🔧 **Build Management**: Track and manage Docker builds
- 🔍 **Advanced Search**: Search containers by ID, image, status, and more
- ⚡ **Real-time Updates**: Live status updates and monitoring
- 🎨 **Modern UI**: Dark theme with responsive design
- 📊 **Container Stats**: View CPU, memory, and network usage

## Screenshots

![Anchor Dashboard](./docs/images/dashboard.png)

## Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn
- Docker API Backend Server running on `http://localhost:3000` (see [API.md](./API.md))

## Quick Start

### Option 1: Using Dev Container (Recommended)

The fastest way to get started with a consistent development environment:

1. **Prerequisites:**
   - Install [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Install [VS Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

2. **Clone and open:**
   ```bash
   git clone https://github.com/TheDevStallion96/anchor-vue-ui.git
   cd anchor-vue-ui
   code .
   ```

3. **Reopen in container:**
   - When prompted, click "Reopen in Container"
   - Or press `F1` and select `Dev Containers: Reopen in Container`

4. **Start developing:**
   ```bash
   npm run dev
   ```

See [.devcontainer/README.md](.devcontainer/README.md) for more details.

### Option 2: Local Installation

```bash
# Clone the repository
git clone https://github.com/TheDevStallion96/anchor-vue-ui.git
cd anchor-vue-ui

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
anchor-vue-ui/
├── public/                    # Static assets
├── src/
│   ├── assets/               # Styles and images
│   │   └── styles/
│   │       └── tailwind.css  # Tailwind CSS configuration
│   ├── components/           # Vue components
│   │   ├── common/          # Reusable UI components
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── ErrorAlert.vue
│   │   │   └── LoadingSpinner.vue
│   │   ├── layout/          # Layout components
│   │   │   ├── AppHeader.vue
│   │   │   ├── AppSidebar.vue
│   │   │   └── AppLayout.vue
│   │   ├── features/        # Feature-specific components
│   │   │   └── containers/
│   │   │       ├── ContainersDashboard.vue
│   │   │       ├── ContainerTable.vue
│   │   │       ├── ContainerRow.vue
│   │   │       ├── ContainerStats.vue
│   │   │       └── ContainerSearch.vue
│   │   └── icons/           # SVG icon components
│   ├── composables/         # Vue Composition API composables
│   │   ├── useDockerApi.js
│   │   ├── useApi.js
│   │   ├── useToggle.js
│   │   └── useErrorHandling.js
│   ├── stores/              # Pinia state management
│   │   ├── containers.js
│   │   └── counter.js
│   ├── router/              # Vue Router configuration
│   │   ├── index.js
│   │   └── routes.js
│   ├── utils/               # Utility functions
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── containerUtils.js
│   ├── views/               # Page components
│   │   ├── HomeView.vue          # Containers dashboard
│   │   ├── ImagesView.vue        # Images management
│   │   ├── VolumesView.vue       # Volumes management
│   │   ├── KubernetesView.vue    # Kubernetes dashboard
│   │   ├── BuildsView.vue        # Builds dashboard
│   │   ├── AboutView.vue         # About page
│   │   └── NotFoundView.vue      # 404 page
│   ├── App.vue
│   └── main.js
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── README.md                # This file
├── API.md                   # Docker API documentation
└── CONTRIBUTING.md          # Contribution guidelines
```

## Configuration

### Environment Variables

Create a `.env` file in the root directory or copy from `.env.example`:

```bash
# Copy the example environment file
cp .env.example .env
```

**Available environment variables:**

```env
# Docker API Host (default: localhost)
VITE_DOCKER_API_HOST=localhost

# Docker API Port (default: 3000)
VITE_DOCKER_API_PORT=3000

# Complete Docker API Base URL (auto-generated if not provided)
VITE_DOCKER_API_BASE_URL=http://localhost:3000/api/v1
```

**Note:** You can either set `VITE_DOCKER_API_HOST` and `VITE_DOCKER_API_PORT` individually, or provide the complete `VITE_DOCKER_API_BASE_URL`. If you provide the complete URL, it will take precedence.

### Docker API Backend

This UI requires a Docker API backend server. The backend provides RESTful endpoints for Docker operations. See [API.md](./API.md) for complete API documentation.

**Key endpoints:**
- `GET /api/v1/containers/all` - List all containers
- `POST /api/v1/containers/:id/start` - Start a container
- `POST /api/v1/containers/:id/stop` - Stop a container
- `GET /api/v1/images` - List Docker images
- `GET /api/v1/system/info` - Get Docker system information

## Technology Stack

- **Vue.js 3** - Progressive JavaScript framework
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Composition API** - Modern Vue 3 API for component logic

## Key Features & Components

### Container Management

The container dashboard provides comprehensive Docker container management:

- **Real-time Status**: Live container status updates (running, stopped, exited)
- **Bulk Operations**: Select and perform actions on multiple containers
- **Advanced Search**: Search by container ID, image name, or status using syntax like `id:abc123` or `image:nginx`
- **Container Actions**: Start, stop, restart, pause, unpause, and remove containers
- **Log Viewing**: View container logs with customizable line count
- **Stats Monitoring**: Real-time CPU, memory, and network statistics

### State Management

Anchor uses Pinia for state management with the following stores:

- **Containers Store** (`stores/containers.js`): Manages container data, filtering, sorting, and Docker API interactions
- **Counter Store** (`stores/counter.js`): Example store for demonstration purposes

### Composables

Reusable composition functions:

- **useDockerApi**: Handles all Docker API calls with error handling
- **useApi**: Generic API wrapper with loading states
- **useToggle**: Simple boolean state toggle
- **useErrorHandling**: Centralized error handling utilities

## Development

### Code Style

This project follows Vue.js 3 best practices:

- Composition API with `<script setup>` syntax
- Single File Components (SFC)
- Component-based architecture
- Reactive state management with Pinia
- Props validation and type checking
- Consistent naming conventions

### Component Organization

Components are organized by purpose:

- **common/**: Reusable UI components (buttons, cards, inputs)
- **layout/**: Page layout components (header, sidebar, footer)
- **features/**: Feature-specific components grouped by domain
- **icons/**: SVG icon components

### Adding a New Feature

1. Create a new view in `src/views/`
2. Add the route in `src/router/routes.js`
3. Create feature-specific components in `src/components/features/`
4. Add state management in `src/stores/` if needed
5. Update navigation in `src/utils/constants.js`

## Troubleshooting

### Cannot connect to Docker API

If you see "Cannot connect to Docker API" error:

1. Ensure the Docker API backend is running on `http://localhost:3000`
2. Check if the API server allows CORS requests
3. Verify the `VITE_DOCKER_API_BASE_URL` environment variable is set correctly
4. Test the API connection using the "Test Connection" button in the UI

### Build Errors

If you encounter build errors:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Docker API design inspired by Docker Desktop
- UI components built with Tailwind CSS
- Icons from Heroicons and custom SVG designs

## Support

For issues and questions:
- Open an issue on GitHub
- Check the [API.md](./API.md) for backend API documentation
- Review existing issues for common problems

---

Built with ❤️ using Vue.js 3 and Tailwind CSS