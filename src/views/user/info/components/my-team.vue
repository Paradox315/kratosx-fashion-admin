<template>
  <a-card
    class="general-card"
    :title="$t('userInfo.tab.title.group')"
    :header-style="{ paddingBottom: '18px' }"
    :body-style="{ paddingBottom: '12px' }"
  >
    <a-list :bordered="false">
      <a-list-item
        v-for="team in defaultValue"
        :key="team.id"
        action-layout="horizontal"
      >
        <a-skeleton v-if="loading" :loading="loading" :animation="true">
          <a-row :gutter="6">
            <a-col :span="6">
              <a-skeleton-shape shape="circle" />
            </a-col>
            <a-col :span="16">
              <a-skeleton-line :widths="['100%', '40%']" :rows="2" />
            </a-col>
          </a-row>
        </a-skeleton>
        <a-list-item-meta v-else :title="team.name">
          <template #avatar>
            <a-avatar>
              <img :src="team.avatar" />
            </a-avatar>
          </template>
          <template #description> 共{{ team.peopleNumber }}人 </template>
        </a-list-item-meta>
      </a-list-item>
    </a-list>
  </a-card>
</template>

<script lang="ts" setup>
  import { MyTeamRecord } from '@/api/user-center';

  const loading = false;
  const defaultValue: MyTeamRecord[] = new Array(0).fill({});
</script>

<style scoped lang="less">
  .general-card {
    height: 356px;

    .arco-list-item {
      height: 72px;
      padding-bottom: 12px;
      padding-left: 0;
      border-bottom: 1px solid var(--color-neutral-3);

      &:last-child {
        border-bottom: none;
      }

      .arco-list-item-meta {
        padding: 0;
      }
    }
  }
</style>
