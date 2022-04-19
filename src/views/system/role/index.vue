<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.role']" />
    <a-card class="general-card" :title="$t('system.role.title')">
      <RoleTable></RoleTable>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import RoleTable from './components/role-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'Role',
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
