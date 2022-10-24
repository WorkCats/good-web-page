import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'

// @ts-ignore
import AutoImport from 'unplugin-auto-import/vite'
// @ts-ignore
import Components from 'unplugin-vue-components/vite';
// @ts-ignore
import { ArcoResolver } from 'unplugin-vue-components/resolvers';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        AutoImport({
            resolvers: [ArcoResolver()],
        }),
        Components({
            resolvers: [
                ArcoResolver({
                    sideEffect: true
                })
            ]
        })
    ],
    server: {
        host: '0.0.0.0',
        port: 4000,
    },
    base: './',
    build: {
        // 清除console和debugger
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            }
        },
    }
})
