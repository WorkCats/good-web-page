<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider
          default-collapsed
          hide-trigger
          width="30vw"
          collapsed-width="0"
          collapsible
          breakpoint="md">
        <a-layout class="side-layout">
          <a-layout-header>
            <a-typography>
              <a-typography-title :bold="true" :heading="5">
                GOODS MANAGER
              </a-typography-title>

              <a-typography-title :heading="3">
                Start your<br>
                journey with us.
              </a-typography-title>
              I know you can't read it, so here's a piece of crap.
            </a-typography>
          </a-layout-header>
        </a-layout>
      </a-layout-sider>
      <a-layout style="padding: 24px 36px;">
        <a-layout-content>
          <a-card class="login-card" title="Login">
            <a-input
                class="login-card-input"
                placeholder="输入密码"
                allow-clear>
              <template #prefix>
                <icon-user/>
              </template>
            </a-input>
            <a-input
                class="login-card-input"
                placeholder="输入账号"
                allow-clear>
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input>

            <a-button
                class="login-card-button"
                type="primary"
                size="large">
              登录
            </a-button>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import {defineComponent} from 'vue';
import {IconUser, IconLock} from '@arco-design/web-vue/es/icon';

export default defineComponent({
  components: {
    IconUser,
    IconLock
  },
  methods: {}
});
</script>
<style scoped>
.layout {
  height: 100vh;
  background: var(--color-fill-2);
}

.layout :deep(.arco-layout-sider) {
  background: var(--color-bg-1);
}

.layout :deep(.arco-layout-content), .login-card, .login-card :deep(.arco-card-body) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.login-card {
  margin: 24px;
  padding: 24px;
  border-radius: 10px;
}

.login-card-input, .login-card-button {
  margin: 12px 24px;
  width: 100%;
  height: 48px;
}


.side-layout {
  padding: 16px 24px;
}

.card-github{
  width: 100%;
  transition-property: all;
}

.card-github:hover {
  transform: translateY(-4px);
}


</style>
