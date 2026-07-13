// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import type { ConfigEnv, PluginOption } from "vite";

// The Lovable dev config hardcodes TanStack devtools' `injectSource` feature, which
// stamps a `data-tsd-source="file:line:col"` attribute on every JSX element. The SSR and
// client transform pipelines see the same source file at different line offsets (the client
// pipeline's react-refresh preamble shifts everything down ~2 lines), so those attributes
// disagree and React logs a hydration mismatch on every load. It's dev-only and benign, but
// noisy. `injectSource` isn't exposed as an option, so strip just that one plugin
// (`@tanstack/devtools:inject-source`) from the resolved list — the rest of devtools stays.
const INJECT_SOURCE_PLUGIN = "@tanstack/devtools:inject-source";

function stripInjectSource(plugins: PluginOption[]): PluginOption[] {
  return plugins
    .map((plugin) => (Array.isArray(plugin) ? stripInjectSource(plugin) : plugin))
    .filter(
      (plugin) =>
        !(
          plugin &&
          typeof plugin === "object" &&
          "name" in plugin &&
          (plugin as { name?: string }).name === INJECT_SOURCE_PLUGIN
        ),
    );
}

const buildConfig = defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});

export default async (env: ConfigEnv) => {
  const config = await buildConfig(env);
  if (Array.isArray(config.plugins)) {
    config.plugins = stripInjectSource(config.plugins);
  }
  return config;
};
