# Contributing to Anchor Vue UI

Thank you for your interest in contributing to Anchor Vue UI! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Component Guidelines](#component-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect different viewpoints and experiences

## Getting Started

### Prerequisites

- Node.js (^20.19.0 || >=22.12.0)
- npm or yarn
- Git
- Docker API backend (for testing)

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:

```bash
git clone https://github.com/YOUR_USERNAME/anchor-vue-ui.git
cd anchor-vue-ui
```

3. Add the upstream repository:

```bash
git remote add upstream https://github.com/TheDevStallion96/anchor-vue-ui.git
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

## Development Workflow

### Create a Branch

Always create a new branch for your work:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

Branch naming conventions:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests

### Make Changes

1. Make your changes following the [Coding Standards](#coding-standards)
2. Test your changes thoroughly
3. Ensure the build passes: `npm run build`

### Sync with Upstream

Keep your fork up to date:

```bash
git fetch upstream
git checkout master
git merge upstream/master
```

## Coding Standards

### Vue.js Style Guide

Follow the official [Vue.js Style Guide](https://vuejs.org/style-guide/).

### Key Conventions

#### Use Composition API with `<script setup>`

```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref } from 'vue'

const message = ref('Hello World')
</script>
```

#### Component Naming

- Use PascalCase for component names: `ContainerRow.vue`, `BaseButton.vue`
- Use multi-word component names: `ContainersDashboard.vue` (not `Dashboard.vue`)

#### Props Validation

Always validate props:

```javascript
const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
```

#### Emits Declaration

Declare all emits:

```javascript
const emit = defineEmits(['click', 'update:modelValue'])
```

### Code Formatting

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas in multi-line objects/arrays
- Use semicolons

### File Organization

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components
│   ├── features/        # Feature-specific components
│   └── icons/           # Icon components
├── composables/         # Composition functions
├── stores/              # Pinia stores
├── views/               # Page components
├── router/              # Router configuration
└── utils/               # Utility functions
```

## Component Guidelines

### Creating a New Component

1. **Place the component in the appropriate directory**:
   - `common/` for reusable UI components
   - `features/{domain}/` for domain-specific components
   - `layout/` for layout components

2. **Use meaningful names**:
   ```vue
   <!-- Good -->
   ContainerRow.vue
   ErrorAlert.vue
   LoadingSpinner.vue
   
   <!-- Bad -->
   Row.vue
   Alert.vue
   Spinner.vue
   ```

3. **Add props validation**:
   ```javascript
   const props = defineProps({
     container: {
       type: Object,
       required: true
     },
     showActions: {
       type: Boolean,
       default: true
     }
   })
   ```

4. **Emit custom events**:
   ```javascript
   const emit = defineEmits(['delete', 'start', 'stop'])
   
   const handleDelete = () => {
     emit('delete', props.container.id)
   }
   ```

### Composable Guidelines

Create composables for reusable logic:

```javascript
// useDockerApi.js
import { ref } from 'vue'

export function useDockerApi() {
  const loading = ref(false)
  const error = ref(null)
  
  const fetchContainers = async () => {
    loading.value = true
    try {
      // ... implementation
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    error,
    fetchContainers
  }
}
```

### Store Guidelines

Use Pinia for state management:

```javascript
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useContainersStore = defineStore('containers', () => {
  // State
  const containers = ref([])
  
  // Getters
  const runningContainers = computed(() => 
    containers.value.filter(c => c.status === 'running')
  )
  
  // Actions
  function fetchContainers() {
    // ... implementation
  }
  
  return {
    containers,
    runningContainers,
    fetchContainers
  }
})
```

## Commit Messages

Use clear, descriptive commit messages following the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes

### Examples

```bash
feat(containers): add bulk delete functionality
fix(api): handle connection timeout errors
docs(readme): update installation instructions
refactor(components): simplify container row component
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with the latest upstream changes:
   ```bash
   git fetch upstream
   git rebase upstream/master
   ```

2. **Ensure your code builds**:
   ```bash
   npm run build
   ```

3. **Test your changes** manually

4. **Review your changes**:
   ```bash
   git diff master
   ```

### Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Open a Pull Request on GitHub

3. Fill out the PR template with:
   - Description of changes
   - Screenshots (if UI changes)
   - Related issues
   - Testing instructions

4. Wait for review and address feedback

### Pull Request Guidelines

- Keep PRs focused and small
- One feature/fix per PR
- Include screenshots for UI changes
- Update documentation if needed
- Ensure CI passes

## Testing

### Manual Testing

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Test your changes in the browser

3. Test different scenarios:
   - Different container states
   - Error conditions
   - Edge cases

### Testing Docker Integration

1. Ensure the Docker API backend is running
2. Test API connectivity
3. Test container operations (start, stop, delete)
4. Verify error handling

## Questions?

If you have questions:
- Open an issue on GitHub
- Check existing issues and PRs
- Review the documentation

Thank you for contributing to Anchor Vue UI! 🎉
