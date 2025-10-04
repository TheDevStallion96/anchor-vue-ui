# Docker API Documentation

## Overview

This RESTful API provides complete Docker management capabilities designed for integration with an Electron-based Linux desktop application. The API enables container and image management, system monitoring, and real-time Docker operations through a clean HTTP interface.

## Base URL

```
http://localhost:3000/api/v1
```

## Authentication

Currently, this API is designed for local development and Electron app integration. No authentication is required for localhost access.

## Response Format

All API responses follow a consistent structure:

**Success Response:**
```json
{
  "success": true,
  "data": {},
  "count": 5
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

## Container Management

### List All Containers
**GET** `/containers/all`

Returns all containers (running and stopped).

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "abc123def456",
      "name": "my-container",
      "image": "nginx:latest",
      "status": "running",
      "state": "running",
      "created": "2023-10-04T10:30:00Z"
    }
  ]
}
```

### List Running Containers
**GET** `/containers`

Returns only running containers.

### Get Container Details
**GET** `/containers/:id`

Returns detailed information about a specific container.

**Parameters:**
- `id` - Container ID (short or full hash)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "name": "my-container",
    "image": "nginx:latest",
    "status": "running",
    "ports": [
      {
        "privatePort": 80,
        "publicPort": 8080,
        "type": "tcp"
      }
    ],
    "mounts": [],
    "networkSettings": {}
  }
}
```

### Get Container Logs
**GET** `/containers/:id/logs?lines=100`

Retrieves logs from a specific container.

**Parameters:**
- `id` - Container ID
- `lines` (query) - Number of log lines to retrieve (default: 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "abc123def456",
    "lines": 100,
    "logs": "Container log output here..."
  }
}
```

### Get Container Stats
**GET** `/containers/:id/stats`

Returns real-time statistics for a container.

**Response:**
```json
{
  "success": true,
  "data": {
    "cpuUsage": 25.5,
    "memoryUsage": 128000000,
    "memoryLimit": 512000000,
    "networkIO": {
      "rx": 1024,
      "tx": 2048
    }
  }
}
```

### Start Container
**POST** `/containers/:id/start`

Starts a stopped container.

**Response:**
```json
{
  "success": true,
  "message": "Container abc123def456 started successfully"
}
```

### Stop Container
**POST** `/containers/:id/stop`

Stops a running container.

### Restart Container
**POST** `/containers/:id/restart`

Restarts a container.

### Remove Container
**DELETE** `/containers/:id?force=true`

Removes a container.

**Parameters:**
- `force` (query) - Force removal (true/false, default: false)

## Image Management

### List Images
**GET** `/images`

Returns all Docker images.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "id": "sha256:abc123...",
      "repository": "nginx",
      "tag": "latest",
      "size": 142000000,
      "created": "2023-10-01T12:00:00Z"
    }
  ]
}
```

### Get Image Details
**GET** `/images/:id`

Returns detailed information about a specific image.

### Pull Image
**POST** `/images/pull`

Pulls an image from a registry.

**Request Body:**
```json
{
  "imageName": "nginx:latest"
}
```

### Remove Image
**DELETE** `/images/:id?force=true`

Removes an image.

**Parameters:**
- `force` (query) - Force removal (true/false)

### Build Image
**POST** `/images/build`

Builds an image from a Dockerfile.

**Request Body:**
```json
{
  "context": "/path/to/build/context",
  "dockerfile": "Dockerfile",
  "tag": "my-app:latest"
}
```

## System Information

### Get Docker Info
**GET** `/system/info`

Returns Docker system information.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "20.10.8",
    "containers": 5,
    "containersRunning": 3,
    "containersStopped": 2,
    "images": 10,
    "memTotal": 8000000000
  }
}
```

### Get System Version
**GET** `/system/version`

Returns Docker version information.

### Monitor Events
**GET** `/system/events`

Streams Docker events (Server-Sent Events).

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found (container/image doesn't exist)
- `409` - Conflict (container already running/stopped)
- `500` - Internal Server Error (Docker daemon issues)

## Usage Examples

### Using curl

```bash
# List all containers
curl http://localhost:3000/api/v1/containers/all

# Get container logs
curl "http://localhost:3000/api/v1/containers/abc123/logs?lines=50"

# Start a container
curl -X POST http://localhost:3000/api/v1/containers/abc123/start

# Pull an image
curl -X POST http://localhost:3000/api/v1/images/pull \
  -H "Content-Type: application/json" \
  -d '{"imageName": "nginx:latest"}'
```

### Using JavaScript (Fetch API)

```javascript
// List containers
const response = await fetch('http://localhost:3000/api/v1/containers/all');
const { success, data, count } = await response.json();

// Start container
await fetch(`http://localhost:3000/api/v1/containers/${containerId}/start`, {
  method: 'POST'
});

// Get container stats
const statsResponse = await fetch(`http://localhost:3000/api/v1/containers/${containerId}/stats`);
const stats = await statsResponse.json();
```

## Development Notes

### Docker Socket Configuration

The API connects to Docker via the Unix socket at `/var/run/docker.sock` by default. This is configured in the environment variables:

```bash
DOCKER_SOCKET_PATH=/var/run/docker.sock
```

### Environment Variables

```bash
PORT=3000
NODE_ENV=development
API_VERSION=v1
DOCKER_SOCKET_PATH=/var/run/docker.sock
```

### Starting the Development Server

```bash
npm run dev  # Uses nodemon for auto-reload
```

The server will display all available endpoints at startup.

## Integration with Electron

This API is specifically designed to be consumed by an Electron desktop application. The consistent response format and comprehensive error handling make it ideal for desktop app integration where users need reliable Docker management capabilities.

### Recommended Usage Pattern

1. **Health Check**: Always verify Docker connection via `/system/info`
2. **Real-time Updates**: Use `/system/events` for live Docker event monitoring
3. **Error Handling**: Check the `success` field in all responses
4. **Resource Management**: Use `/containers/all` and `/images` for dashboard views
5. **Operations**: Use the action endpoints for container lifecycle management

## Rate Limiting

Currently, no rate limiting is implemented as this API is designed for local Electron app usage. For production deployments, consider implementing appropriate rate limiting middleware.