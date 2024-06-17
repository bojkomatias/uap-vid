import { defineConfig } from 'vitest/config';
import { defineConfig as viteDefineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(
  viteDefineConfig({
    // ... other Vite configurations
    plugins: [tsconfigPaths()],
    test: {
      environment: "jsdom",

    }
  }),
);