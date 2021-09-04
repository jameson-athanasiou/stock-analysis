// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */
module.exports = {
  mount: {
    dist: '/',
  },
  plugins: ['@snowpack/plugin-babel'],
  packageOptions: {
    polyfillNode: true,
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
  alias: {
    components: './client/src/components',
    context: './client/src/context',
    hooks: './client/src/hooks',
    routes: './client/src/routes',
    util: './client/src/util',
  },
}
