import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
// @ts-ignore
import {createStyleImportPlugin} from 'vite-plugin-style-import';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        createStyleImportPlugin({
            libs: [{
                    libraryName: '@arco-design/web-vue',
                    esModule: true,
                    resolveStyle: (name) => {
                        return `@arco-design/web-vue/es/${name}/style/css.js`
                    },
                }
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
