<template>
  <a-row style="margin-bottom: 16px">
    <a-col :span="16">
      <a-space>
        <a-button type="primary" @click="saveRole">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('system.table.create') }}
        </a-button>
        <a-button
          type="text"
          status="danger"
          :disabled="disableDeleteBtn"
          @click="delRoles"
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
    :data="roles"
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
    <template #optional="{ record }">
      <a-space>
        <a-button @click="viewInfo(record)"
          >{{ $t('system.table.view') }}
        </a-button>
        <a-button type="primary" @click="editInfo(record)"
          >{{ $t('system.table.edit') }}
        </a-button>
        <a-button
          type="primary"
          status="success"
          @click="showResource(record.id)"
        >
          {{ $t('system.role.permission.setting') }}
        </a-button>
        <a-button status="danger" type="primary" @click="delRole(record.id)"
          >{{ $t('system.table.delete') }}
        </a-button>
      </a-space>
    </template>
  </a-table>
  <a-modal
    v-model:visible="showModal"
    :width="600"
    :ok-loading="loading"
    :on-before-ok="handleRoleSubmit"
    unmount-on-close
  >
    <template #title>{{ $t('system.role.title') }}</template>
    <a-form ref="formRef" :model="roleForm">
      <a-form-item
        field="name"
        :label="$t('system.role.name')"
        :rules="[
          {
            required: true,
            message: $t('system.role.form.name.required'),
          },
        ]"
      >
        <a-input
          v-model="roleForm.name"
          :placeholder="$t('system.role.form.name.placeholder')"
        />
      </a-form-item>
      <a-form-item field="description" :label="$t('system.role.description')">
        <a-input
          v-model="roleForm.description"
          :placeholder="$t('system.role.form.description.placeholder')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <TableSetting
    v-model:setting="setting"
    v-model:visible="showSetting"
    @check-box-change="setDeleteBatch"
  ></TableSetting>
  <ResourceSetting
    v-model:checked-obj="checkedObj"
    v-model:visible="showResourceSetting"
    v-model:role-id="roleId"
  ></ResourceSetting>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import { computed, h, reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { RoleReply, RoleRequest } from '@/api/model/role';
  import { createRole, deleteRole, getRoleList, updateRole } from '@/api/role';
  import { DescData, Modal, Descriptions, Message } from '@arco-design/web-vue';
  import { Menu, Router } from '@/api/model/resource';
  import {
    getActionByRole,
    getMenuByRole,
    getRouterTreeByRole,
  } from '@/api/resource';
  import { IconDelete, IconPlus } from '@arco-design/web-vue/es/icon';
  import useTableSetting from '@/components/table-setting/table-setting';
  import useDeleteBatch from '@/hooks/delete-batch';
  import { createAsyncComponent } from '@/utils/factory';
  import { usePagination } from 'vue-request';

  const TableSetting = createAsyncComponent(
    () => import('@/components/table-setting/index.vue')
  );
  const ResourceSetting = createAsyncComponent(
    () => import('@/views/system/role/components/resource-setting.vue')
  );
  const { t } = useI18n();
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
  } = usePagination(getRoleList, {
    pagination: {
      totalKey: 'metadata.total',
    },
  });
  const roles = computed(() => data.value?.metadata.list || []);
  // form相关控件
  const formRef = ref<FormInstance>();
  const checkedObj = reactive({
    checkedMenus: Array<string>(),
    checkedRouters: Array<string>(),
    checkedActs: Array<string>(),
  });
  const roleForm = reactive<RoleRequest>({});
  const roleId = ref<string | number>(0);
  // 弹窗相关
  const showModal = ref(false);
  const showResourceSetting = ref(false);
  const isEdit = ref(false);

  const selectedRoles = ref<string[]>([]);
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: false,
  });
  const columns = [
    {
      title: 'RID',
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
    },
    {
      title: t('system.role.name'),
      dataIndex: 'name',
    },
    {
      title: t('system.role.description'),
      dataIndex: 'description',
    },
    {
      title: t('system.role.createdAt'),
      dataIndex: 'createdAt',
    },
    {
      title: t('system.role.updatedAt'),
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
    return selectedRoles.value.length === 0 || !deleteBatch.value;
  });
  const resetRoleForm = () => {
    roleForm.resources = [];
    roleForm.routers = [];
    roleForm.id = 0;
    roleForm.name = '';
    roleForm.description = '';
  };
  const resetChecked = () => {
    checkedObj.checkedMenus = [];
    checkedObj.checkedRouters = [];
    checkedObj.checkedActs = [];
  };

  // viewInfo 查看角色信息
  const viewInfo = (record: RoleReply) => {
    const roleDesc: DescData[] = [
      {
        label: t('system.role.name'),
        value: record.name as string,
      },
      {
        label: t('system.role.description'),
        value: record.description as string,
      },
      {
        label: t('system.role.createdAt'),
        value: record.createdAt as string,
      },
      {
        label: t('system.role.updatedAt'),
        value: record.updatedAt as string,
      },
    ];
    Modal.open({
      title: t('system.role.title'),
      content: () => {
        return h(Descriptions, {
          data: roleDesc,
          title: t('system.role.title'),
          column: 1,
        });
      },
    });
  };

  // saveRole 保存角色信息
  const saveRole = () => {
    isEdit.value = false;
    showModal.value = true;
    resetRoleForm();
  };

  // editInfo 编辑角色信息
  const editInfo = (record: RoleReply) => {
    isEdit.value = true;
    showModal.value = true;
    roleForm.id = record.id;
    roleForm.name = record.name;
    roleForm.description = record.description;
  };

  // deleteRole 删除角色信息
  const delRole = async (id: string) => {
    Modal.warning({
      title: t('system.role.delete.title'),
      content: t('system.role.delete.content'),
      onOk: async () => {
        await deleteRole(id);
        await refresh();
      },
    });
  };

  // deleteRoles 删除多个角色
  const delRoles = () => {
    Modal.warning({
      title: t('system.role.delete.title'),
      content: t('system.role.delete.content'),
      onOk: async () => {
        await deleteRole(selectedRoles.value.join(','));
        await refresh();
        resetDeleteBatch();
      },
    });
  };

  const buildCheckedMenus = (menus?: Menu[]) => {
    menus?.forEach((menu: Menu) => {
      checkedObj.checkedMenus.push(menu.id as string);
    });
  };
  const buildCheckedActs = (acts?: string[]) => {
    acts?.forEach((act: string) => {
      checkedObj.checkedActs.push(act);
    });
  };
  const buildCheckedRouters = (routers?: Router[]) => {
    routers?.forEach((router: Router) => {
      checkedObj.checkedRouters.push(
        JSON.stringify({
          method: router.method,
          path: router.path,
        })
      );
    });
  };

  // showResource 显示资源管理弹窗
  const showResource = async (id: string) => {
    showResourceSetting.value = true;
    roleId.value = id;
    const { metadata: roleMenu } = await getMenuByRole(id);
    const { metadata: roleRouter } = await getRouterTreeByRole(id);
    const { metadata: roleAct } = await getActionByRole(id);
    resetRoleForm();
    resetChecked();
    buildCheckedRouters(roleRouter.roleRouters);
    buildCheckedMenus(roleMenu.list);
    buildCheckedActs(roleAct.list);
  };
  const onSelect = (rowKeys: string[]) => {
    selectedRoles.value = rowKeys;
  };
  const handleRoleSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        loading.value = true;
        if (isEdit.value) {
          await updateRole(roleForm);
          Message.success(t('system.role.update.success'));
        } else {
          await createRole(roleForm);
          Message.success(t('system.role.create.success'));
        }
        await refresh();
        done();
      } catch (e) {
        done(false);
      } finally {
        loading.value = false;
      }
    }
  };
</script>

<style scoped></style>
