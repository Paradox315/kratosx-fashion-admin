<template>
  <a-row style="margin-bottom: 16px">
    <a-col :span="24" style="text-align: right">
      <a-button @click="setSetting(true)">
        <template #icon>
          <icon-settings />
        </template>
        {{ $t('system.table.setting') }}
      </a-button>
    </a-col>
  </a-row>
  <a-table
    row-key="id"
    :columns="columns"
    :scroll="setting.scroll"
    :bordered="{ cell: setting.border }"
    :hoverable="setting.hover"
    :stripe="setting.stripe"
    :size="setting.size"
    :column-resizable="setting.columnResizable"
    :loading="loading"
    :data="routers"
    :pagination="{
      pageSize: pageSize,
      total: total,
      current: current,
      showPageSize: true,
    }"
    @page-change="changeCurrent"
    @page-size-change="changePageSize"
  >
    <template #method="{ record }">
      <a-space wrap>
        <a-tag
          v-for="(item, index) of computed(() => getMethods(record)).value"
          :key="index"
          :color="item.color"
          >{{ item.method }}</a-tag
        >
      </a-space>
    </template>
  </a-table>
  <TableSetting
    v-model:setting="setting"
    v-model:visible="showSetting"
    :disable-checkbox="true"
  ></TableSetting>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { getRouterList } from '@/api/resource';
  import { Router, RouterGroup } from '@/api/model/resource';
  import TableSetting from '@/components/table-setting/index.vue';
  import useTableSetting from '@/components/table-setting/table-setting';
  import { usePagination } from 'vue-request';

  const { t } = useI18n();
  const { setting, showSetting, setSetting } = useTableSetting();
  const {
    data,
    current,
    pageSize,
    loading,
    total,
    changeCurrent,
    changePageSize,
  } = usePagination(getRouterList, {
    pagination: {
      totalKey: 'metadata.total',
    },
    cacheKey: 'permission',
    cacheTime: 300000, // 5 minutes
  });
  const routers = computed(() => data.value?.metadata?.list || []);
  const columns = [
    {
      title: t('system.router.name'),
      dataIndex: 'name',
    },
    {
      title: t('system.router.path'),
      dataIndex: 'path',
    },
    {
      title: t('system.router.method'),
      dataIndex: 'method',
      slotName: 'method',
    },
    {
      title: t('system.router.params'),
      dataIndex: 'params',
    },
  ];

  const getMethods = (record: RouterGroup | Router) => {
    return record?.method?.split('|').map((item) => {
      const getColor = (name: string) => {
        switch (name) {
          case 'GET':
            return '#1abc9c';
          case 'POST':
            return '#ffa502';
          case 'PUT':
            return '#1e90ff';
          case 'DELETE':
            return '#f5222d';
          default:
            return '#1abc9c';
        }
      };
      const name = item.substring(1, item.length - 1);
      return {
        method: name,
        color: getColor(name),
      };
    });
  };
</script>

<style scoped></style>
