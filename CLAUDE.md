# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cleo is a Voice Feedback Demo for AI Medical Scribe Instructions built with SvelteKit. While the README describes an advanced voice feedback system, the current implementation is in early stages with the basic SvelteKit starter template.

## Essential Commands

### Development
```bash
pnpm dev          # Start development server at http://localhost:5173
pnpm preview      # Preview production build locally
```

### Build & Deploy
```bash
pnpm build        # Create production build in .svelte-kit/output
```

### Code Quality
```bash
pnpm check        # Run svelte-check for type checking
pnpm check:watch  # Continuous type checking during development
```

### Testing
```bash
pnpm test         # Run all tests once
pnpm test:unit    # Run tests in watch mode
```

## Architecture & Code Organization

### Directory Structure
- `/src/routes/` - SvelteKit pages and API routes
  - `+page.svelte` - Page components
  - `+page.server.ts` - Server-side page logic
  - `+server.ts` - API endpoints
- `/src/lib/` - Shared components and utilities
  - Components should be organized by feature
  - Use `$lib` alias for imports
- `/src/app.css` - Global styles (Tailwind CSS imports)

### Technology Stack
- **Framework**: SvelteKit 2.22.0 with Svelte 5.0.0 (using new runes syntax)
- **Styling**: Tailwind CSS 4.0.0 with Vite plugin
- **AI SDK**: Vercel AI SDK with OpenAI provider
- **Validation**: Zod for schema validation
- **Testing**: Vitest with Playwright for browser testing

### Key Patterns

1. **Svelte 5 Runes**: Use `$props()` for component props instead of `export let`
2. **TypeScript**: Strict mode is enabled - ensure all types are properly defined
3. **Testing**: 
   - Component tests: `*.svelte.test.ts` files run in browser environment
   - Unit tests: `*.test.ts` files run in Node environment

### Planned Features (from README)

The following features are documented but not yet implemented:
- Voice input capture using Web Audio API
- Real-time instruction processing with LLM
- Instruction version history
- Instruction optimization
- Export functionality

When implementing these features, consider:
- Server-side API routes in `/src/routes/api/`
- Client-side components in `/src/lib/components/`
- Stores for state management in `/src/lib/stores/`
- Type definitions in `/src/lib/types/`

### Development Guidelines

1. **State Management**: Use Svelte stores for global state, component state for local state
2. **API Design**: REST endpoints in `/src/routes/api/` following SvelteKit conventions
3. **Error Handling**: Use SvelteKit's error handling with proper status codes
4. **TypeScript**: Define interfaces for all data structures
5. **Component Structure**: Keep components small and focused on single responsibilities

### AI Integration Notes

The project includes AI SDK dependencies but no implementation yet. When implementing:
- Use server-side routes (`+server.ts`) for AI API calls
- Store API keys in environment variables
- Implement proper error handling for AI responses
- Consider streaming responses for better UX

### Testing Strategy

- Write component tests for all UI components
- Test API routes with integration tests
- Mock external services (AI APIs) in tests
- Use Playwright for E2E testing of critical flows