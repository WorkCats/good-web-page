<template>
  <a-layout class="layout">
    <a-result status="404" subtitle="这个页面走丢了">
      <template #extra>
        <a-space direction="vertical">
          <a-spin />
          <a-typography style="background: var(--color-fill-2); padding: 24px;">
            <a-typography-paragraph>Tip:</a-typography-paragraph>
            <ul>
              <li>尝试切换其他页面</li>
              <li>或者可以尝试询问管理员</li>
            </ul>
          </a-typography>
        </a-space>
      </template>
    </a-result>
  </a-layout>

</template>

<script>
export default {
  name: "NotFound"
}
</script>

<style scoped>
.layout {
  height: 100vh;
  background: var(--color-bg-1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

</style>
