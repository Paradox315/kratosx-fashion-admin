<template>
  <a-row style="margin-bottom: 16px">
    <a-col :span="16">
      <a-space>
        <a-button type="primary" @click="saveMenu">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('system.menu.table.add') }}
        </a-button>
        <a-button
          type="text"
          status="danger"
          :disabled="disableDeleteBtn"
          @click="delMenus"
        >
          <template #icon>
            <icon-delete />
          </template>
          {{ $t('system.table.deleteBatch') }}
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="8" style="text-align: right">
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
    :row-selection="setting.checkbox ? rowSelection : undefined"
    :loading="loading"
    :data="menus"
    :pagination="{
      pageSize: pageSize,
      total: total,
      current: current,
      showPageSize: true,
    }"
    @page-change="changeCurrent"
    @page-size-change="changePageSize"
    @select="onSelect"
  >
    <template #meta="{ record }">
      <a-space wrap>
        <a-tag
          v-for="(roleId, index) of record.meta.roles"
          :key="index"
          :color="'#70a1ff'"
          >roleID:{{ roleId }}
        </a-tag>
      </a-space>
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button type="primary" @click="saveMenuChild(record.id)"
          >{{ $t('system.menu.table.addChild') }}
        </a-button>
        <a-button type="primary" @click="editMenu(record)"
          >{{ $t('system.table.edit') }}
        </a-button>
        <a-button status="danger" type="primary" @click="delMenu(record.id)"
          >{{ $t('system.table.delete') }}
        </a-button>
      </a-space>
    </template>
  </a-table>
  <a-modal
    v-model:visible="showModal"
    :width="1000"
    :on-before-ok="handleMenuSubmit"
    :ok-loading="loading"
    unmount-on-close
  >
    <template #title>{{ $t('menu.system.menu') }}</template>
    <a-form ref="formRef" :model="menuForm" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            field="name"
            :label="$t('system.menu.name')"
            :rules="[
              {
                required: true,
                message: $t('system.menu.form.name.required'),
              },
            ]"
          >
            <a-input
              v-model="menuForm.name"
              :placeholder="$t('system.menu.form.name.placeholder')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            field="path"
            :label="$t('system.menu.path')"
            :rules="[
              {
                required: true,
                message: $t('system.menu.form.path.required'),
              },
            ]"
          >
            <a-input
              v-model="menuForm.path"
              :placeholder="$t('system.menu.form.path.placeholder')"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            field="description"
            :label="$t('system.menu.description')"
          >
            <a-input
              v-model="menuForm.description"
              :placeholder="$t('system.menu.form.description.placeholder')"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            field="parent_id"
            :label="$t('system.menu.parentId')"
            disabled
          >
            <a-select
              v-model="menuForm.parentId"
              :placeholder="$t('system.menu.form.parentId.placeholder')"
            >
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="16">
          <a-form-item
            field="component"
            :label="$t('system.menu.component')"
            :rules="[
              {
                required: true,
                message: $t('system.menu.form.component.required'),
              },
            ]"
          >
            <a-input
              v-model="menuForm.component"
              :placeholder="$t('system.menu.form.component.placeholder')"
            >
            </a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider>{{ $t('system.menu.meta') }}</a-divider>
      <a-row :gutter="16" style="margin-top: 25px">
        <a-col :span="8">
          <a-form-item field="icon" :label="$t('system.menu.meta.icon')">
            <IconPicker v-model="menuForm.meta.icon" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="locale" :label="$t('system.menu.meta.locale')">
            <a-input v-model="menuForm.meta.locale" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="order" :label="$t('system.menu.meta.order')">
            <a-input-number v-model="menuForm.meta.order" :min="0" :max="100" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="6">
          <a-form-item
            field="requireAuth"
            :label="$t('system.menu.meta.requireAuth')"
          >
            <a-switch v-model="menuForm.meta.requireAuth" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            field="hideInMenu"
            :label="$t('system.menu.meta.hideInMenu')"
          >
            <a-switch v-model="menuForm.meta.hideInMenu" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="noAffix" :label="$t('system.menu.meta.noAffix')">
            <a-switch v-model="menuForm.meta.noAffix" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            field="ignoreCache"
            :label="$t('system.menu.meta.ignoreCache')"
          >
            <a-switch v-model="menuForm.meta.ignoreCache" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-space>
        <a-button type="primary" @click="addAction"
          >{{ $t('system.menu.action.add') }}
        </a-button>
      </a-space>
      <a-divider>{{ $t('system.menu.actions') }}</a-divider>
      <a-form-item
        v-for="(action, index) of menuForm.actions"
        :key="index"
        :field="`actions.${index}`"
        :label="$t('system.menu.actions') + `${index + 1}`"
      >
        <a-form-item
          :field="`action.${index}.name`"
          :label="$t('system.menu.action.name')"
        >
          <a-input v-model="action.name" />
        </a-form-item>
        <a-form-item
          :field="`action.${index}.code`"
          :label="$t('system.menu.action.code')"
        >
          <a-input v-model="action.code" />
        </a-form-item>
        <a-form-item>
          <a-button
            type="primary"
            :style="{ marginLeft: '10px' }"
            shape="circle"
            status="danger"
            @click="deleteAct(index)"
          >
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </a-form-item>
      </a-form-item>
    </a-form>
  </a-modal>
  <TableSetting
    v-model:setting="setting"
    v-model:visible="showSetting"
    @check-box-change="setDeleteBatch"
  ></TableSetting>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    createMenu,
    deleteMenu,
    getMenuList,
    updateMenu,
  } from '@/api/resource';
  import IconPicker from '@/components/icon-picker/index.vue';
  import { Menu, MenuRequest } from '@/api/model/resource';
  import TableSetting from '@/components/table-setting/index.vue';
  import useTableSetting from '@/components/table-setting/table-setting';
  import useDeleteBatch from '@/hooks/delete-batch';
  import { usePagination } from 'vue-request';
  import { usePermissionStore, useUserStore } from '@/store';

  const { t } = useI18n();
  const { setRoutes } = usePermissionStore();
  const userStore = useUserStore();
  const { setting, showSetting, setSetting } = useTableSetting();
  const { deleteBatch, setDeleteBatch, resetDeleteBatch } = useDeleteBatch();
  const {
    data,
    current,
    pageSize,
    loading,
    total,
    changeCurrent,
    changePageSize,
    refresh,
  } = usePagination(getMenuList, {
    pagination: {
      totalKey: 'metadata.total',
    },
  });

  const menus = computed(() => data.value?.metadata.list || []);
  const formRef = ref<FormInstance>();
  const menuForm = reactive<MenuRequest>({
    meta: {
      requireAuth: true,
    },
    actions: [],
  });
  const showModal = ref<boolean>(false);
  const isEdit = ref(false);
  const selectedMenus = ref<string[]>([]);
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: false,
  });
  const columns = [
    {
      title: t('system.menu.id'),
      dataIndex: 'id',
      fixed: 'left',
      width: 100,
    },
    {
      title: t('system.menu.parentId'),
      dataIndex: 'parentId',
    },
    {
      title: t('system.menu.description'),
      dataIndex: 'description',
    },
    {
      title: t('system.menu.name'),
      dataIndex: 'name',
    },
    {
      title: t('system.menu.path'),
      dataIndex: 'path',
    },
    {
      title: t('system.menu.component'),
      dataIndex: 'component',
      width: 200,
    },
    {
      title: t('system.menu.meta'),
      dataIndex: 'meta',
      slotName: 'meta',
    },
    {
      title: t('system.menu.createdAt'),
      dataIndex: 'createdAt',
    },
    {
      title: t('system.menu.updatedAt'),
      dataIndex: 'updatedAt',
    },
    {
      title: t('system.table.actions'),
      slotName: 'optional',
      fixed: 'right',
      width: 320,
    },
  ];

  const disableDeleteBtn = computed(() => {
    return selectedMenus.value.length === 0 || !deleteBatch.value;
  });
  const refreshRoutes = () => {
    refresh();
    setRoutes(userStore.currentRole as string);
    Modal.warning({
      title: t('system.menu.refreshRoutes'),
      content: t('system.menu.refreshRoutes.warning'),
      okText: t('system.menu.refresh.confirm'),
      onOk: () => {
        window.location.reload();
      },
    });
  };
  const onSelect = (rowKeys: string[]) => {
    selectedMenus.value = rowKeys;
  };
  const resetMenuForm = () => {
    menuForm.id = 0;
    menuForm.parentId = 0;
    menuForm.name = '';
    menuForm.path = '';
    menuForm.component = '';
    menuForm.description = '';
    menuForm.meta = {
      icon: '',
      locale: '',
      order: 0,
      hideInMenu: false,
      ignoreCache: false,
      noAffix: false,
      requireAuth: true,
    };
    menuForm.actions = [];
  };
  const addAction = () => {
    menuForm.actions?.push({
      name: '',
      code: '',
    });
  };
  const deleteAct = (index: number) => {
    menuForm.actions?.splice(index, 1);
  };

  const saveMenu = () => {
    showModal.value = true;
    isEdit.value = false;
    resetMenuForm();
  };
  const saveMenuChild = (id: string) => {
    showModal.value = true;
    isEdit.value = false;
    resetMenuForm();
    menuForm.parentId = id;
  };
  const editMenu = (record: Menu) => {
    showModal.value = true;
    isEdit.value = true;
    menuForm.id = record.id;
    menuForm.parentId = record.parentId;
    menuForm.name = record.name;
    menuForm.path = record.path;
    menuForm.description = record.description;
    menuForm.component = record.component;
    menuForm.meta = record.meta;
    menuForm.actions = record.actions ? record.actions : [];
  };
  const delMenu = (id: string) => {
    Modal.warning({
      title: t('system.menu.delete.title'),
      content: t('system.menu.delete.content'),
      onOk: async () => {
        await deleteMenu(id);
        Message.success(t('system.menu.delete.success'));
        await refreshRoutes();
      },
    });
  };
  const delMenus = () => {
    Modal.warning({
      title: t('system.menu.delete.title'),
      content: t('system.menu.delete.content'),
      onOk: async () => {
        await deleteMenu(selectedMenus.value.join(','));
        Message.success(t('system.menu.delete.success'));
        selectedMenus.value = [];
        resetDeleteBatch();
        await refreshRoutes();
      },
    });
  };
  const handleMenuSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        loading.value = true;
        if (isEdit.value) {
          await updateMenu(menuForm);
          Message.success(t('system.menu.edit.success'));
        } else {
          await createMenu(menuForm);
          Message.success(t('system.menu.add.success'));
        }
        await refreshRoutes();
        done();
      } catch (err) {
        done(false);
      } finally {
        loading.value = false;
      }
    } else {
      done(false);
    }
  };
</script>

<style scoped></style>
