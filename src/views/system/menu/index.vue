<template>
  <div class="container">
    <Breadcrumb :items="['menu.system', 'menu.system.menu']" />
    <a-card class="general-card" :title="$t('menu.system.menu')">
      <MenuTable></MenuTable>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import MenuTable from '@/views/system/menu/components/menu-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'Menu',
  };
</script>

<style scoped>
  .container {
    padding: 0 20px 20px 20px;
  }
</style>
