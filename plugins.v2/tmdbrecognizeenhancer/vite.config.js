import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import federation from '@originjs/vite-plugin-federation'
import { readFileSync } from 'node:fs'

const packageInfo = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'))
const uiVersionDir = `v${packageInfo.version.replace(/[^A-Za-z0-9._-]+/g, '_')}`

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'TmdbRecognizeEnhancer',
      filename: 'remoteEntry.js',
      exposes: {
        './Page': './src/components/Page.vue',
        './Config': './src/components/Config.vue',
        './Dashboard': './src/components/Dashboard.vue',
        './AppPage': './src/components/AppPage.vue',
      },
      shared: {
        vue: { requiredVersion: false, generate: false },
      },
      format: 'esm',
    }),
  ],
  build: {
    // 联邦入口不能跨版本复用同一个 URL，否则浏览器和 federation runtime
    // 会继续返回当前页面内存中的旧模块。
    outDir: `dist/ui/${uiVersionDir}`,
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
  },
  define: {
    __TMDB_ENHANCER_UI_VERSION__: JSON.stringify(packageInfo.version),
  },
  css: {
    postcss: {
      plugins: [
        {
          postcssPlugin: 'internal:charset-removal',
          AtRule: {
            charset: atRule => {
              if (atRule.name === 'charset') atRule.remove()
            },
          },
        },
        {
          postcssPlugin: 'vuetify-filter',
          Root(root) {
            root.walkRules(rule => {
              if (rule.selector && (rule.selector.includes('.v-') || rule.selector.includes('.mdi-'))) {
                rule.remove()
              }
            })
          },
        },
      ],
    },
  },
})
