// @lovable.dev/vite-tanstack-config already includes tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro, VITE_* env injection — do NOT add them manually.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    build: {
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "supabase",
                test: /node_modules[\\/]@supabase[\\/]/,
                includeDependenciesRecursively: false,
                priority: 20,
              },
              {
                name: "react-query",
                test: /node_modules[\\/]@tanstack[\\/]react-query[\\/]/,
                includeDependenciesRecursively: false,
                priority: 15,
              },
              {
                name: "radix",
                test: /node_modules[\\/]@radix-ui[\\/]/,
                // Os primitivos Radix dependem uns dos outros. Separar somente
                // os pacotes @radix-ui criou um ciclo entre os chunks `radix`
                // e `select` em produção, deixando SelectPrimitive.Trigger
                // indefinido durante a hidratação. Mantê-los com as
                // dependências compartilhadas elimina esse ciclo.
                includeDependenciesRecursively: true,
                priority: 15,
              },
              {
                // Precisa incluir as dependências (d3-scale, d3-shape etc.) no
                // mesmo chunk: separá-las causa corrida no carregamento dos
                // módulos em produção ("TypeError: X is not a function"),
                // porque o código de topo da recharts roda antes das
                // dependências terminarem de carregar num chunk à parte.
                name: "recharts",
                test: /node_modules[\\/]recharts[\\/]/,
                includeDependenciesRecursively: true,
                priority: 15,
              },
            ],
          },
        },
      },
    },
  },
  tanstackStart: { server: { entry: "server" } },
});
