import {createApp} from 'vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import {createRouter, createWebHashHistory} from "vue-router";
import { Message } from '@arco-design/web-vue';

import './style.css'
import App from './App.vue'
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/login",
        name: "Login",
        component: Login
    },

]

const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})

const app = createApp(App);
app.use(router);
app.use(ArcoVue);

app.mount('#app');
Message._context = app._context;
