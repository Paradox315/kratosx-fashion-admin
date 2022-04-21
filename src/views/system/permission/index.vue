<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.permission']" />
    <a-card class="general-card" :title="$t('system.permission.title')">
      <RouterTable></RouterTable>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import RouterTable from './components/router-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'Permission',
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
