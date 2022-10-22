<template>
  <a-layout class="layout-home">
    <a-layout-header>
      <a-page-header
          title="货物管理系统">
        <template #subtitle>
          <a-space>
            <span>这里展示的所有用户</span>
          </a-space>
        </template>
      </a-page-header>
    </a-layout-header>
    <a-layout-content>
    </a-layout-content>
  </a-layout>
  <a-button size="large"
            class="add-bt"
            shape="circle">
    <icon-plus/>
  </a-button>
</template>

<script>
import {IconPlus} from '@arco-design/web-vue/es/icon';

export default {
  name: "Admin",
  components: {
    IconPlus
  },
  setup() {
    return {
    }
  }
}
</script>

<style scoped>
.layout-home {
  height: 100vh;
  background: var(--color-fill-2);
}

.layout-home :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}

.layout-home :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.layout-home :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  color: var(--color-white);
  font-size: 16px;
}

.add-bt {
  position: fixed;
  background: var(--color-bg-5) !important;
  border: 1px solid var(--color-fill-3) !important;
  box-shadow: 0 2px 12px var(--color-neutral-3);
  right: 60px;
  bottom: 80px;
}
</style>
