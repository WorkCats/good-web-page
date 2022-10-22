
<template>
  <router-view></router-view>
</template>

<script lang="js">
export default {
  name: "App"
}
const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
const isDarkMode = darkThemeMq.matches;
if(isDarkMode) document.body.setAttribute('arco-theme', 'dark');

darkThemeMq.addEventListener('change', (event) => {
  // is dark mode
  if (event.matches)
    document.body.setAttribute('arco-theme', 'dark');
  else
    document.body.removeAttribute('arco-theme');
});

</script>
<style scoped>

</style>
