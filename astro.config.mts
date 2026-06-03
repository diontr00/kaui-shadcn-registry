import { defineConfig, envField } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import starlightThemeBlack from "starlight-theme-black";

import { loadEnv } from "vite";

import react from "@astrojs/react";

const { GITHUB_URL, URL } = loadEnv(
  process.env.NODE_ENV ?? "production",
  process.cwd(),
  "",
);

// https://astro.build/config
export default defineConfig({
  site: URL,
  integrations: [
    starlight({
      title: "KaUI",
      favicon: "/favicon.ico",
      head: [{ tag: "link", attrs: { rel: "icon", href: "/favicon.ico" } }],
      customCss: ["./src/styles/global.css"],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: GITHUB_URL,
        },
      ],
      sidebar: [
        {
          label: "Get Started",
          items: [
            // Each item here is one entry in the navigation menu.
            { label: "Introduction", slug: "get-started/introduction" },
            { label: "Installation", slug: "get-started/installation" },
          ],
        },
        {
          label: "Components",
          items: [{ autogenerate: { directory: "components" } }],
        },
      ],

      components: {
        Head: "./src/components/override/head.astro",
        Banner: "./src/components/override/banner.astro",
      },

      plugins: [
        starlightThemeBlack({
          navLinks: [
            {
              label: "Docs",
              link: "/getting-started",
            },
          ],
          footerText: `Built & designed by [Khanh Anh Trinh](https://khanhanhtr.com). The source code is available on [GitHub](${GITHUB_URL}).`,
        }),
      ],
    }),
    react(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },

  env: {
    schema: {
      GITHUB_URL: envField.string({ context: "client", access: "public" }),
      URL: envField.string({ context: "client", access: "public" }),
    },
  },
});
