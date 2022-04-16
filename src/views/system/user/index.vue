<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.user']" />
    <a-card class="general-card" :title="$t('menu.list.searchTable')">
      <UserTable></UserTable>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import UserTable from './components/user-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'User',
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
