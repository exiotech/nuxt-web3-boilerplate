import { defineNuxtConfig } from '@nuxt/bridge'
import dotenv from "dotenv";
import i18n from "./i18n";
import pkg from "./package.json";

dotenv.config();

export default defineNuxtConfig({
  // Target: https://go.nuxtjs.dev/config-target
  target: "static",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: process.env.APP_TITLE || pkg.name,
    htmlAttrs: {
      lang: "en",
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.APP_DESC || pkg.description,
      },
      { name: "format-detection", content: "telephone=no" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        hid: "description",
        name: "description",
        content: pkg.description,
      },
      {
        property: "og:title",
        content: process.env.OG_TITLE || process.env.APP_TITLE,
      },
      {
        property: "og:description",
        content: process.env.APP_OG_DESC || process.env.APP_DESC,
      },
      {
        property: "og:image",
        content: `${process.env.APP_URL}/og-image.jpg?v=${pkg.version}`,
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        property: "og:url",
        content: process.env.APP_URL,
      },
      {
        name: "msapplication-TileColor",
        content: "#ffffff",
      },
      {
        name: "msapplication-TileImage",
        content: `/ms-icon-144x144.png?v=${pkg.version}`,
      },
      {
        name: "theme-color",
        content: "#ffffff",
      },
    ],
    link: [
      {
        rel: "shortcut icon",
        type: "image/x-icon",
        href: `favicon.ico?v=${pkg.version}`,
      },
      {
        rel: "apple-touch-icon",
        href: `/apple-touch-icon.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        href: `/android-icon-192x192.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        href: `/android-icon-512x512.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: `/favicon-32x32.png?v=${pkg.version}`,
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: `/favicon-16x16.png?v=${pkg.version}`,
      },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500&display=swap",
      },
    ],
  },

  bridge: {
    meta: true,
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: ["@/assets/scss/app"],

  styleResources: {
    scss: [
      "@/node_modules/bootstrap/scss/_functions.scss",
      "@/node_modules/bootstrap/scss/_mixins.scss",
      "@/assets/scss/_variables.scss",
    ],
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    { src: "~/plugins/web3", mode: "client" },
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    "@nuxtjs/eslint-module",
    "@nuxtjs/stylelint-module",
    "@nuxtjs/style-resources",
    "@nuxtjs/localforage",
    "@nuxtjs/svg",
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/pwa",
    "@nuxtjs/dotenv",
    [
      "nuxt-i18n",
      {
        locales: [
          {
            code: "en",
            name: "English",
          },
        ],
        defaultLocale: "en",
        vueI18n: {
          fallbackLocale: "en",
          messages: i18n,
        },
      },
    ],
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {},

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      lang: "en",
    },
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extractCSS: true,
    extend: (config) => {
      config.node = {
        fs: "empty",
      };
    },
  },

  env: {
    app: {
      name: process.env.APP_TITLE || pkg.name,
      DEFAULT_CHAIN_ID: process.env.DEFAULT_CHAIN_ID || 1,
    },
  },
  generate: {
    fallback: true,
  },
  router: {
    linkActiveClass: 'sub-active',
    linkExactActiveClass: 'active',
  },
});
