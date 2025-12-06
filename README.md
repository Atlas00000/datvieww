<div align="center">

# 📊 DataView

### Visualizing Insights, Transforming Data

**A visually stunning, enterprise-grade data visualization dashboard built with modern web technologies**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![D3.js](https://img.shields.io/badge/D3-7-F97316?style=for-the-badge&logo=d3.js)](https://d3js.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Testing](#-testing) • [Deployment](#-deployment) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎨 Visual Excellence
- **Glassmorphism Design**: Modern frosted glass effects with backdrop blur
- **Animated Gradients**: Dynamic color transitions and ambient orbs
- **Interactive Animations**: Smooth transitions, hover effects, and micro-interactions
- **Responsive Layout**: Mobile-first design that adapts beautifully to all screen sizes
- **Loading Screen**: Stunning animated loading experience with particle effects

### 📈 Data Visualization
- **30+ Chart Types**: Histograms, pie/donut charts, stacked bars, heatmaps, treemaps, sunbursts, scatter plots, gauges, density plots, and more
- **Interactive Features**: 
  - Crosshair tracking on all charts
  - Detailed data breakdown tooltips
  - Hover effects with smooth transitions
  - Active state indicators
- **Real-time Updates**: Dynamic data visualization with Zustand state management
- **Export Capabilities**: CSV export functionality for data tables

### 🏗️ Architecture
- **Component-Based**: Modular, reusable components following best practices
- **Type-Safe**: Full TypeScript coverage with strict type checking
- **Performance Optimized**: Code splitting, lazy loading, and optimized builds
- **Accessible**: WCAG-compliant components with proper ARIA labels

### 🚀 Developer Experience
- **Hot Reload**: Instant feedback during development
- **Docker Support**: Full containerization for development and production
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks
- **Comprehensive Documentation**: Detailed guides and examples

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20.x or higher
- **pnpm**: 8.x or higher (recommended) or npm/yarn
- **Docker**: 20.10+ (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd datvieww

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

### Docker Quick Start

```bash
# Development mode (with hot reload)
docker-compose up --build

# Production mode
docker-compose -f docker-compose.prod.yml up --build -d
```

See [Docker Guide](./DOCKER.md) for detailed instructions.

---

## 🏛️ Architecture

### Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 14 | React framework with App Router |
| **Language** | TypeScript 5 | Type-safe development |
| **Styling** | Tailwind CSS 3 | Utility-first CSS framework |
| **Visualization** | D3.js 7 | Data-driven document manipulation |
| **State Management** | Zustand | Lightweight state management |
| **Package Manager** | pnpm | Fast, disk-efficient package manager |
| **Containerization** | Docker | Consistent deployment environments |

### Project Structure

```
datvieww/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Homepage dashboard
│   │   ├── dataview/          # Data table view
│   │   ├── layout.tsx         # Root layout
│   │   └── loading.tsx        # Loading screen
│   ├── components/
│   │   ├── effects/           # Visual effects (gradients, glass, etc.)
│   │   ├── hero/              # Hero section components
│   │   ├── layout/            # Layout components (Header, Footer, etc.)
│   │   ├── loading/           # Loading screen components
│   │   ├── sections/          # Section-specific components
│   │   ├── ui/                # Reusable UI components
│   │   └── visualization/     # D3 chart components
│   ├── data/
│   │   └── mockData.ts        # Mock data generator
│   ├── hooks/
│   │   └── useLoading.ts      # Custom React hooks
│   ├── lib/
│   │   └── utils.ts           # Utility functions
│   ├── stores/
│   │   └── visualizationStore.ts  # Zustand store
│   └── types/
│       └── user.types.ts      # TypeScript type definitions
├── public/                     # Static assets
├── Dockerfile                  # Production Docker image
├── Dockerfile.dev              # Development Docker image
├── docker-compose.yml          # Docker Compose configuration
└── next.config.js              # Next.js configuration
```

### Component Architecture

The application follows a **modular component architecture**:

- **Layout Components**: Header, Footer, Section, Container, Grid
- **UI Components**: Button, Card, Input, Tooltip, Spinner, Progress
- **Effect Components**: BackgroundGradient, GlassCard, GradientOrb, HoverEffect
- **Visualization Components**: 30+ D3 chart components with interactive features
- **Section Components**: Reusable section headers and chart cards

### Design System

The application follows a comprehensive design system documented in [UI Philosophy](./UI_philosophy.md):

- **Color Palette**: Primary (#0066FF), Secondary (#00D9FF), Accent (#FF3366)
- **Typography**: Inter for body text, gradient text for headings
- **Spacing**: Consistent 4px-based spacing scale
- **Animations**: Purposeful motion with smooth easing curves
- **Glassmorphism**: Frosted glass effects with backdrop blur

---

## 🧪 Testing

### Testing Philosophy

We follow **industry best practices** for testing, ensuring reliability, maintainability, and confidence in our codebase.

### Testing Strategy

#### 1. **Unit Testing**
Test individual components and functions in isolation.

```bash
# Run unit tests
pnpm test

# Run with coverage
pnpm test:coverage

# Watch mode
pnpm test:watch
```

**Best Practices:**
- ✅ Test component rendering and props
- ✅ Test user interactions (clicks, inputs)
- ✅ Test edge cases and error states
- ✅ Aim for >80% code coverage
- ✅ Use descriptive test names
- ✅ Keep tests isolated and independent

**Example Test Structure:**
```typescript
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 2. **Integration Testing**
Test component interactions and data flow.

```bash
# Run integration tests
pnpm test:integration
```

**Best Practices:**
- ✅ Test component composition
- ✅ Test state management (Zustand stores)
- ✅ Test API interactions (if applicable)
- ✅ Test routing and navigation
- ✅ Use real user scenarios

#### 3. **Visual Regression Testing**
Ensure UI consistency across changes.

```bash
# Run visual regression tests
pnpm test:visual
```

**Best Practices:**
- ✅ Capture screenshots of key components
- ✅ Compare against baseline images
- ✅ Test across different viewport sizes
- ✅ Include dark mode variants (if applicable)

#### 4. **End-to-End (E2E) Testing**
Test complete user workflows.

```bash
# Run E2E tests
pnpm test:e2e
```

**Best Practices:**
- ✅ Test critical user paths
- ✅ Test form submissions
- ✅ Test data visualization interactions
- ✅ Test responsive behavior
- ✅ Use realistic test data

**Example E2E Test:**
```typescript
describe('Dashboard Navigation', () => {
  it('allows users to navigate between sections', async () => {
    await page.goto('http://localhost:3000');
    await page.click('text=Data View');
    await expect(page).toHaveURL('http://localhost:3000/dataview');
  });
});
```

#### 5. **Performance Testing**
Ensure optimal performance and load times.

```bash
# Run performance tests
pnpm test:performance
```

**Best Practices:**
- ✅ Test page load times
- ✅ Test bundle sizes
- ✅ Test chart rendering performance
- ✅ Test with large datasets
- ✅ Monitor Core Web Vitals

#### 6. **Accessibility Testing**
Ensure the application is accessible to all users.

```bash
# Run accessibility tests
pnpm test:a11y
```

**Best Practices:**
- ✅ Test with screen readers
- ✅ Test keyboard navigation
- ✅ Test ARIA labels and roles
- ✅ Test color contrast ratios
- ✅ Test focus management

### Testing Tools

| Tool | Purpose | Status |
|------|---------|--------|
| **Jest** | Unit and integration testing | ✅ Recommended |
| **React Testing Library** | Component testing | ✅ Recommended |
| **Playwright** | E2E testing | ✅ Recommended |
| **Cypress** | Alternative E2E testing | 🔄 Optional |
| **Storybook** | Component development and testing | 🔄 Optional |
| **Lighthouse CI** | Performance and accessibility | ✅ Recommended |

### Test Coverage Goals

- **Unit Tests**: >80% coverage
- **Integration Tests**: Cover all critical paths
- **E2E Tests**: Cover all user workflows
- **Accessibility**: WCAG 2.1 AA compliance

### Continuous Integration

Tests run automatically on:
- ✅ Every pull request
- ✅ Every commit to main branch
- ✅ Before deployment

**CI Pipeline:**
```yaml
# Example GitHub Actions workflow
- Run linting
- Run type checking
- Run unit tests
- Run integration tests
- Run E2E tests
- Run accessibility tests
- Generate coverage report
```

### Testing Best Practices Summary

1. **Write tests first** (TDD) when possible
2. **Test behavior, not implementation**
3. **Keep tests simple and focused**
4. **Use descriptive test names**
5. **Mock external dependencies**
6. **Test edge cases and error states**
7. **Maintain test coverage above 80%**
8. **Review test failures immediately**
9. **Keep tests fast and independent**
10. **Document complex test scenarios**

---

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Production build
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint errors
pnpm type-check       # TypeScript type checking
pnpm format           # Format code with Prettier
pnpm format:check     # Check code formatting

# Testing (when implemented)
pnpm test             # Run unit tests
pnpm test:watch       # Run tests in watch mode
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests
pnpm test:a11y        # Run accessibility tests

# Docker
pnpm docker:dev       # Start Docker development
pnpm docker:down      # Stop Docker containers

# Utilities
pnpm clean            # Remove build artifacts
```

---

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#0066FF` | Main actions, links, primary elements |
| **Secondary** | `#00D9FF` | Secondary actions, accents |
| **Accent** | `#FF3366` | Highlights, important information |
| **Success** | `#10B981` | Success states, positive feedback |
| **Warning** | `#F59E0B` | Warning states, caution |
| **Error** | `#EF4444` | Error states, destructive actions |

### Typography

- **Primary Font**: Inter (body text, UI elements)
- **Display Font**: Plus Jakarta Sans (headings, hero text)
- **Monospace**: JetBrains Mono (data, code)

### Spacing Scale

4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px, 128px

### Animation Principles

- **Purposeful**: Every animation serves a function
- **Smooth**: 60fps with proper easing curves
- **Responsive**: Reacts to user input
- **Delightful**: Subtle moments of surprise

See [UI Philosophy](./UI_philosophy.md) for complete design system documentation.

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure build settings:
   - **Build Command**: `pnpm build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`
4. Deploy!

### Docker

```bash
# Build production image
docker build -t datvieww-prod .

# Run container
docker run -p 3000:3000 datvieww-prod
```

See [Docker Guide](./DOCKER.md) for detailed instructions.

### Other Platforms

- **AWS**: Use ECS/ECR with Docker
- **Google Cloud**: Use Cloud Run with Docker
- **Azure**: Use Container Instances
- **DigitalOcean**: Use App Platform or Droplets

---

## 📚 Documentation

- [UI Philosophy](./UI_philosophy.md) - Complete design system documentation
- [Docker Guide](./DOCKER.md) - Docker setup and deployment guide
- [Component Documentation](./docs/components.md) - Component API reference (coming soon)
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute (coming soon)

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**: Follow the code style and write tests
4. **Run tests**: Ensure all tests pass
5. **Commit changes**: Use conventional commit messages
6. **Push to branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**: Provide a clear description

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write self-documenting code
- Add comments for complex logic
- Keep components small and focused

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new chart component
fix: resolve header navigation issue
docs: update README with testing section
style: format code with Prettier
refactor: simplify chart rendering logic
test: add unit tests for Button component
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js** team for the amazing framework
- **D3.js** community for powerful visualization tools
- **Tailwind CSS** for the utility-first CSS framework
- **Vercel** for seamless deployment platform

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and D3.js**

[Report Bug](https://github.com/your-repo/issues) • [Request Feature](https://github.com/your-repo/issues) • [Documentation](./docs)

</div>
