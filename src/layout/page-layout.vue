<template>
  <router-view>
    <template #default>
      <router-view v-slot="{ Component, route }">
        <SlideInOut>
          <component
            :is="Component"
            v-if="route.meta.ignoreCache"
            :key="route.fullPath"
          />
          <keep-alive v-else :include="cacheList">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </SlideInOut>
      </router-view>
    </template>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';
  import { SlideInOut } from 'vue3-transitions';

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
