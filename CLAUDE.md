# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run on web browser
- `npx biome check .` - Run linter, formatter and import sorting
- `npx biome format .` - Format code
- `npx biome lint .` - Run linter
- `npx tsc --noEmit` - Run TypeScript typechecking

## Code Style Guidelines
- **Formatting**: Use Biome formatter with 2-space indentation
- **Quotes**: Single quotes for JavaScript/TypeScript strings
- **Imports**: Organize imports with Biome's import sorting
- **Types**: Use TypeScript with strict mode enabled
- **Component Style**: Functional components with React hooks
- **Error Handling**: Use try/catch blocks with typed errors
- **Naming**: PascalCase for components, camelCase for variables and functions
- **Styling**: Use React Native StyleSheet for component styling
- **Colors**: Use the project's yellow theme color (#ffed03) as primary branding

## React Native & Expo
- Built with Expo SDK 52
- Uses React Native Reanimated for animations
- New Architecture enabled ("newArchEnabled": true)