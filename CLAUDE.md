# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Test Commands
- Build: `npm run prebuild`
- Start: `npm start`
- Run on iOS: `npm run ios`
- Run on Android: `npm run android`
- Run on Web: `npm run web`
- Lint: `npx biome check .`
- Format: `npx biome format --write .`
- Type Check: `npx tsc --noEmit`

## Code Style Guidelines
- **Formatting**: Uses Biome with space indentation
- **Quotes**: Use single quotes for strings
- **Imports**: Organize imports (enabled in Biome)
- **TypeScript**: Strict mode enabled
- **Components**: Use functional components with TypeScript types
- **Styling**: Use React Native StyleSheet for styling
- **Error Handling**: Use try/catch blocks for async operations
- **Naming**: Use camelCase for variables/functions, PascalCase for components
- **CSS Modules**: Enabled for styling
- **Git**: Follow conventional commit format