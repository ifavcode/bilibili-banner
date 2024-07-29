import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import {
  AntDesignVueResolver,
} from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '~/': `${resolve(__dirname, 'src')}/`
    }
  },
  plugins: [
    vue(),
    Components({
      dirs: ['src/components', 'src/view'],
      extensions: ['vue'],
      dts: 'config/components.d.ts',
      include: [/\.vue$/, /\.vue\?vue/],
      exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
      resolvers: [
        AntDesignVueResolver({
          importStyle: false
        })
      ]
    }),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'config/auto-import.d.ts',
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
})
