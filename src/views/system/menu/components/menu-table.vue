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
          :disabled="!showDelete"
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
      <a-button @click="openDrawer">
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
    :data="renderData"
    :pagination="pagination"
    @page-change="onPageChange"
    @select="onSelect"
  >
    <template #meta="{ record }">
      <a-space wrap>
        <a-tag
          v-for="(roleId, index) of record.meta.roles"
          :key="index"
          :color="'#70a1ff'"
          >roleID:{{ roleId }}</a-tag
        >
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
    :on-before-ok="handleBeforeOk"
    unmount-on-close
  >
    <template #title>{{ $t('menu.system.menu') }}</template>
    <a-form ref="formRef" :model="menuForm" auto-label-width>
      <a-row :gutter="16">
        <a-col :span="12">
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
        <a-col :span="12">
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
      </a-row>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            field="parent_id"
            :label="$t('system.menu.parentId')"
            disabled
          >
            <a-select
              v-model="menuForm.parent_id"
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
            <a-switch v-model="menuForm.meta.require_auth" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            field="hideInMenu"
            :label="$t('system.menu.meta.hideInMenu')"
          >
            <a-switch v-model="menuForm.meta.hide_in_menu" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item field="noAffix" :label="$t('system.menu.meta.noAffix')">
            <a-switch v-model="menuForm.meta.no_affix" />
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item
            field="ignoreCache"
            :label="$t('system.menu.meta.ignoreCache')"
          >
            <a-switch v-model="menuForm.meta.ignore_cache" />
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
    {{ menuForm }}
  </a-modal>
  <a-drawer
    :visible="showDrawer"
    :width="500"
    unmount-on-close
    :footer="false"
    @ok="drawerOk"
    @cancel="closeDrawer"
  >
    <template #title>
      {{ $t('system.table.setting') }}
    </template>
    <a-form>
      <a-form-item :label="$t('system.table.setting.border')" field="border">
        <a-switch v-model="setting.border" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.hover')" field="hover">
        <a-switch v-model="setting.hover" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.stripe')" field="stripe">
        <a-switch v-model="setting.stripe" />
      </a-form-item>
      <a-form-item
        :label="$t('system.table.setting.checkbox')"
        field="checkbox"
      >
        <a-switch v-model="setting.checkbox" @change="checkboxChange" />
      </a-form-item>
      <a-form-item
        :label="$t('system.table.setting.resizeColumn')"
        field="columnResizable"
      >
        <a-switch v-model="setting.columnResizable" />
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.size')" field="size">
        <a-radio-group v-model="setting.size" type="button">
          <a-radio value="mini">
            {{ $t('system.table.setting.size.mini') }}
          </a-radio>
          <a-radio value="small">
            {{ $t('system.table.setting.size.small') }}
          </a-radio>
          <a-radio value="medium">
            {{ $t('system.table.setting.size.medium') }}
          </a-radio>
          <a-radio value="large">
            {{ $t('system.table.setting.size.large') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item :label="$t('system.table.setting.scroll')" field="scroll">
        <a-space direction="vertical">
          <a-input-number
            v-model="setting.scroll.x"
            :style="{ width: '320px' }"
            :default-value="setting.scroll.x"
            :step="100"
            mode="button"
            class="input-demo"
          />
          <a-input-number
            v-model="setting.scroll.y"
            :style="{ width: '320px' }"
            :default-value="setting.scroll.y"
            :step="100"
            mode="button"
            class="input-demo"
          />
        </a-space>
      </a-form-item>
    </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Pagination } from '@/types/global';
  import { Menu, MenuRequest } from '@/types/resource';
  import { Message, Modal } from '@arco-design/web-vue';
  import Error from '@/views/result/error/index.vue';
  import {
    createMenu,
    deleteMenu,
    getMenuList,
    updateMenu,
  } from '@/api/resource';
  import IconPicker from '@/components/icon-picker/index.vue';
  import { deleteUser } from '@/api/user';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const formRef = ref<FormInstance>();
  const renderData = ref<Menu[] | undefined>([]);
  const menuForm = ref<MenuRequest>({});
  const showModal = ref<boolean>(false);
  const showDrawer = ref<boolean>(false);
  const showDelete = ref<boolean>(false);
  const selectedMenus = ref<string[]>([]);
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const setting = reactive({
    border: false,
    hover: true,
    stripe: false,
    checkbox: false,
    columnResizable: true,
    size: 'medium',
    scroll: {
      x: 1600,
      y: 1000,
    },
  });

  const isEdit = ref(false);
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
      dataIndex: 'parent_id',
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
      dataIndex: 'created_at',
    },
    {
      title: t('system.menu.updatedAt'),
      dataIndex: 'updated_at',
    },
    {
      title: t('system.table.actions'),
      slotName: 'optional',
      fixed: 'right',
      width: 320,
    },
  ];
  // fetchData 获取表格数据
  const fetchData = async (
    params: Pagination = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await getMenuList(pagination);
      renderData.value = res.metadata.list;
      pagination.current = params.current;
      pagination.total = res.metadata.total;
    } catch (err) {
      Message.error(t('system.message.fetch.fail'));
    } finally {
      setLoading(false);
    }
  };

  fetchData();

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData(pagination);
  };
  const checkboxChange = () => {
    showDelete.value = setting.checkbox && selectedMenus.value.length > 0;
  };

  const onSelect = (rowKeys: string[]) => {
    showDelete.value = true;
    selectedMenus.value = rowKeys;
  };
  const openDrawer = () => {
    showDrawer.value = true;
  };
  const drawerOk = () => {
    showDrawer.value = false;
  };
  const closeDrawer = () => {
    showDrawer.value = false;
  };
  const resetMenuForm = () => {
    menuForm.value = {
      id: '',
      parent_id: '',
      name: '',
      path: '',
      component: '',
      meta: {
        icon: '',
        locale: '',
        order: 0,
        require_auth: true,
        hide_in_menu: false,
        no_affix: false,
        ignore_cache: false,
      },
      actions: [],
    };
  };
  const addAction = () => {
    menuForm.value.actions?.push({
      name: '',
      code: '',
    });
  };
  const deleteAct = (index: number) => {
    menuForm.value.actions?.splice(index, 1);
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
    menuForm.value.parent_id = id;
  };
  const editMenu = (record: Menu) => {
    showModal.value = true;
    isEdit.value = true;
    menuForm.value.id = record.id;
    menuForm.value.parent_id = record.parent_id;
    menuForm.value.name = record.name;
    menuForm.value.path = record.path;
    menuForm.value.component = record.component;
    menuForm.value.meta = record.meta;
    menuForm.value.actions = record.actions ? record.actions : [];
  };
  const delMenu = (id: string) => {
    Modal.warning({
      title: t('system.menu.delete.title'),
      content: t('system.menu.delete.content'),
      onOk: async () => {
        try {
          await deleteMenu(id);
          Message.success(t('system.menu.delete.success'));
          await fetchData(pagination);
        } catch (error) {
          Message.error(t('system.menu.delete.fail'));
        }
      },
    });
  };
  const delMenus = () => {
    Modal.warning({
      title: t('system.menu.delete.title'),
      content: t('system.menu.delete.content'),
      onOk: async () => {
        try {
          await deleteMenu(selectedMenus.value.join(','));
          Message.success(t('system.menu.delete.success'));
          await fetchData(pagination);
        } catch (error) {
          Message.error(t('system.menu.delete.fail'));
        }
      },
    });
  };
  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        if (isEdit.value) {
          await updateMenu(menuForm.value);
          Message.success(t('system.menu.edit.success'));
        } else {
          await createMenu(menuForm.value);
          Message.success(t('system.menu.add.success'));
        }
        await fetchData(pagination);
        done();
      } catch (err) {
        if (isEdit.value) {
          Message.error(t('system.menu.edit.fail'));
        } else {
          Message.error(t('system.menu.add.fail'));
        }
        done(false);
      }
    } else {
      done(false);
    }
  };
</script>

<style scoped></style>
