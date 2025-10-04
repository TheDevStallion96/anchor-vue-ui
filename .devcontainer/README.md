# Development Container

This directory contains the configuration for the Anchor Vue UI development container.

## What is a Dev Container?

A development container (or dev container for short) allows you to use a Docker container as a full-featured development environment. It can be used to run an application, to separate tools, libraries, or runtimes needed for working with a codebase, and to aid in continuous integration and testing.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running
- [Visual Studio Code](https://code.visualstudio.com/) with the [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

## Getting Started

1. **Open the project in VS Code**

2. **Reopen in Container**
   - Press `F1` and select `Dev Containers: Reopen in Container`
   - Or click the notification that appears when opening the project

3. **Wait for the container to build**
   - The first time will take several minutes as it downloads the base image and installs dependencies
   - Subsequent starts will be much faster

4. **Start developing!**
   - The container automatically runs `npm install` after creation
   - Run `npm run dev` to start the development server
   - The Vite dev server will be available at `http://localhost:5173`

## What's Included

### Base Image
- **Node.js 20**: Matches the project's Node.js requirements (^20.19.0 || >=22.12.0)

### Features
- **Docker-in-Docker**: Allows running Docker commands inside the container
  - Useful for testing with the Docker API backend
  - Access to the host's Docker daemon via socket mount
- **Git**: Version control tools

### VS Code Extensions
The following extensions are automatically installed:

#### Vue.js Development
- **Vue - Official** (Vue.volar): Vue Language Features
- **TypeScript Vue Plugin**: TypeScript support for Vue

#### Code Quality
- **ESLint**: JavaScript/TypeScript linting
- **Prettier**: Code formatting

#### Tailwind CSS
- **Tailwind CSS IntelliSense**: Autocomplete and syntax highlighting for Tailwind

#### General Development
- **GitLens**: Enhanced Git capabilities
- **Path Intellisense**: Autocomplete for file paths
- **Auto Rename Tag**: Automatically rename paired HTML/XML tags

### Port Forwarding
- **5173**: Vite development server
- **3000**: Docker API backend (when running)

### Automatic Setup
- Dependencies are automatically installed via `npm install` when the container is created
- Environment is configured for development

## Configuration

The devcontainer configuration can be customized by editing `.devcontainer/devcontainer.json`:

- **Add more VS Code extensions**: Update the `extensions` array
- **Change port forwarding**: Modify the `forwardPorts` array
- **Add environment variables**: Update the `remoteEnv` section
- **Customize post-create commands**: Modify `postCreateCommand`

## Working with Docker API Backend

The devcontainer includes Docker-in-Docker support, allowing you to:

1. Run the Docker API backend inside the same container
2. Test Docker operations without leaving the development environment
3. Access the host's Docker daemon for managing real containers

To start the Docker API backend (if available):
```bash
# Inside the devcontainer terminal
# Follow the Docker API backend setup instructions
```

## Troubleshooting

### Container won't start
- Ensure Docker Desktop is running
- Check Docker Desktop resources (memory, disk space)
- Try rebuilding the container: `F1` > `Dev Containers: Rebuild Container`

### Port conflicts
- Ensure ports 5173 and 3000 are not in use on your host machine
- Or modify the `forwardPorts` in `devcontainer.json`

### Extensions not loading
- Reload the window: `F1` > `Developer: Reload Window`
- Rebuild the container: `F1` > `Dev Containers: Rebuild Container`

### Docker commands not working
- Ensure Docker Desktop is running
- The container has access to the Docker socket via the mount configuration

## Benefits of Using the Dev Container

✅ **Consistent Environment**: Everyone on the team uses the same development setup  
✅ **Quick Onboarding**: New developers can start coding in minutes  
✅ **No Local Setup**: No need to install Node.js, npm, or other tools locally  
✅ **Isolated**: Project dependencies don't conflict with other projects  
✅ **Pre-configured**: All necessary extensions and tools are included  
✅ **Docker Support**: Built-in Docker-in-Docker for API backend testing

## Additional Resources

- [VS Code Dev Containers Documentation](https://code.visualstudio.com/docs/devcontainers/containers)
- [Dev Container Specification](https://containers.dev/)
- [Available Features](https://containers.dev/features)
