<template>
  <a-card class="general-card" :title="$t('userInfo.title.myFigure')">
    <template #extra>
      <a-link>{{ $t('userInfo.showMore') }}</a-link>
    </template>
    <a-row :gutter="16">
      <a-col
        v-for="(project, index) in defaultValue"
        :key="index"
        :xs="12"
        :sm="12"
        :md="12"
        :lg="12"
        :xl="8"
        :xxl="8"
        class="my-project-item"
      >
        <a-card>
          <a-skeleton v-if="loading" :loading="loading" :animation="true">
            <a-skeleton-line :rows="3" />
          </a-skeleton>
          <a-space v-else direction="vertical">
            <a-typography-text bold>{{ project.name }}</a-typography-text>
            <a-typography-text type="secondary">
              {{ project.description }}
            </a-typography-text>
            <a-space>
              <a-avatar-group :size="24">
                {{ project.contributors }}
                <a-avatar
                  v-for="(contributor, idx) in project.contributors"
                  :key="idx"
                  :size="32"
                >
                  <img alt="avatar" :src="contributor.avatar" />
                </a-avatar>
              </a-avatar-group>
              <a-typography-text type="secondary">
                {{ project.peopleNumber }}
              </a-typography-text>
            </a-space>
          </a-space>
        </a-card>
      </a-col>
      <a-result v-if="!defaultValue.length || !defaultValue" status="404">
        <template #subtitle>
          {{ $t('userInfo.nodata') }}
        </template>
      </a-result>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { MyProjectRecord } from '@/api/user-center';

  const loading = false;
  const defaultValue = Array(0).fill({} as MyProjectRecord);
</script>

<style scoped lang="less">
  :deep(.arco-card-body) {
    min-height: 128px;
    padding-bottom: 0;
  }

  .my-project {
    &-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
    }

    &-title {
      margin-top: 0 !important;
      margin-bottom: 18px !important;
    }

    &-list {
      display: flex;
      justify-content: space-between;
    }

    &-item {
      // padding-right: 16px;
      margin-bottom: 16px;

      &:last-child {
        padding-right: 0;
      }
    }
  }
</style>
