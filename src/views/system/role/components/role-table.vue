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
          :disabled="!showDelete"
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
      <a-button @click="openSetting">
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
          @click="getPermission(record.id)"
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
    :on-before-ok="handleBeforeOk"
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
  <a-drawer
    :visible="showDrawer"
    :width="500"
    unmount-on-close
    :footer="isPermission"
    @ok="savePermission"
    @cancel="cancelPermission"
  >
    <template #title>
      {{
        isPermission
          ? $t('system.role.permission.setting')
          : $t('system.table.setting')
      }}
    </template>
    <a-form v-if="!isPermission">
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
    <a-tabs v-else lazy-load>
      <a-tab-pane key="1" :title="$t('system.role.menu')">
        <a-space direction="vertical" size="large" style="width: 100%">
          <a-card
            ><a-tree
              v-model:checked-keys="checkedMenus"
              block-node
              default-expand-all
              :checkable="true"
              :data="menuTree"
              @select="menuNodeSelect"
            />
          </a-card>
          <a-card v-if="menuAction.get(selectedMenu)">
            <a-checkbox-group v-model="checkedActs" direction="vertical">
              <a-checkbox
                v-for="(act, index) of menuAction.get(selectedMenu)"
                :key="index"
                :value="act.code"
              >
                {{ act.name }}
                <a-tag>{{ act.code }}</a-tag>
              </a-checkbox>
            </a-checkbox-group>
          </a-card>
        </a-space>
      </a-tab-pane>
      <a-tab-pane key="2" :title="$t('system.role.router')">
        <a-tree
          v-model:checked-keys="checkedRouters"
          default-expand-all
          :data="routerTree"
          :checkable="true"
          checked-strategy="parent"
        />
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';
  import useLoading from '@/hooks/loading';
  import { h, reactive, ref } from 'vue';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { RoleReply, RoleRequest } from '@/types/role';
  import { Pagination } from '@/types/global';
  import { createRole, deleteRole, getRoleList, updateRole } from '@/api/role';
  import {
    DescData,
    Modal,
    Descriptions,
    Message,
    TreeNodeData,
    Tag,
  } from '@arco-design/web-vue';
  import { Menu, MenuAction, Router, RouterGroup } from '@/types/resource';
  import {
    getMenuTree,
    getMenuTreeByRole,
    getRouterTree,
    getRouterTreeByRole,
  } from '@/api/resource';
  import {
    IconDelete,
    IconPlus,
    IconQuestion,
  } from '@arco-design/web-vue/es/icon';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const formRef = ref<FormInstance>();
  const renderData = ref<RoleReply[] | undefined>([]);
  const routerTree = ref<TreeNodeData[]>([]);
  const menuTree = ref<TreeNodeData[]>([]);
  const menuAction = ref<Map<string, MenuAction[] | undefined>>(new Map());
  const selectedMenu = ref<string>('');
  const checkedRouters = ref<string[]>([]);
  const checkedMenus = ref<string[]>([]);
  const checkedActs = ref<string[]>([]);
  const roleForm = ref<RoleRequest>({});
  const showModal = ref<boolean>(false);
  const showDrawer = ref<boolean>(false);
  const showDelete = ref<boolean>(false);
  const selectedRoles = ref<string[]>([]);
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
      x: 1000,
      y: 1000,
    },
  });
  const isEdit = ref(false);
  const isPermission = ref(false);
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
      dataIndex: 'created_at',
    },
    {
      title: t('system.role.updatedAt'),
      dataIndex: 'updated_at',
    },
    {
      title: t('system.table.actions'),
      slotName: 'optional',
      fixed: 'right',
      width: 320,
    },
  ];

  // 加载数据方法
  // fetchData 获取表格数据
  const fetchData = async (
    params: Pagination = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await getRoleList(pagination);
      renderData.value = res.metadata.list;
      pagination.current = params.current;
      pagination.total = res.metadata.total;
    } catch (err) {
      Message.error(t('system.role.fetch.fail'));
    } finally {
      setLoading(false);
    }
  };
  const buildRouterTree = (routers?: RouterGroup[]) => {
    routers?.forEach((group: RouterGroup) => {
      const r: TreeNodeData = {
        title: group.name,
        key: JSON.stringify({
          method: group.method,
          path: group.path,
        }),
        children: group.children?.map((router) => {
          return {
            title: router.name,
            key: JSON.stringify({
              method: router.method,
              path: router.path,
            }),
            icon: (): any => {
              switch (router.method) {
                case '(GET)':
                  return h(
                    Tag,
                    {
                      color: '#1abc9c',
                    },
                    () => 'GET'
                  );
                case '(POST)':
                  return h(
                    Tag,
                    {
                      color: '#ffa502',
                    },
                    () => 'POST'
                  );
                case '(PUT)':
                  return h(
                    Tag,
                    {
                      color: '#1e90ff',
                    },
                    () => 'PUT'
                  );
                case '(DELETE)':
                  return h(
                    Tag,
                    {
                      color: '#f5222d',
                    },
                    () => 'DELETE'
                  );
                default:
                  return h(IconQuestion);
              }
            },
          };
        }),
      };
      routerTree.value.push(r);
    });
  };
  const fetchRouters = async () => {
    setLoading(true);
    try {
      const res = await getRouterTree();
      const { routers } = res.metadata;
      buildRouterTree(routers);
    } catch (err) {
      Message.error(t('system.router.fetch.fail'));
    } finally {
      setLoading(false);
    }
  };

  const buildMenuTree = (menus?: Menu[]) => {
    const buildChildTree = (menu: Menu): TreeNodeData => {
      return {
        title: menu.name,
        key: menu.id,
        children: menu.children?.map((child) => buildChildTree(child)),
      };
    };
    menus?.forEach((menu: Menu) => {
      menuTree.value.push(buildChildTree(menu));
    });
  };

  const buildMenuAction = (menus?: Menu[]) => {
    const buildChildAction = (menu: Menu) => {
      menu.children?.forEach((child) => {
        menuAction.value.set(child.id as string, child.actions);
      });
      buildMenuAction(menu.children);
    };
    menus?.forEach((menu: Menu) => {
      buildChildAction(menu);
    });
  };

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await getMenuTree();
      const menus = res.metadata.tree;
      buildMenuTree(menus);
      buildMenuAction(menus);
    } catch (err) {
      Message.error(t('system.router.fetch.fail'));
    } finally {
      setLoading(false);
    }
  };

  fetchData();
  fetchRouters();
  fetchMenus();

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData(pagination);
  };

  // 属性方法
  const openSetting = () => {
    isPermission.value = false;
    showDrawer.value = true;
  };

  // 设置角色权限
  const savePermission = async () => {
    checkedRouters.value.forEach((router) => {
      const routerObj: Router = JSON.parse(router);
      if (!roleForm.value.role_routers) {
        roleForm.value.role_routers = [];
      }
      roleForm.value.role_routers.push(routerObj);
    });
    checkedMenus.value.forEach((menuId) => {
      if (!roleForm.value.role_resources) {
        roleForm.value.role_resources = [];
      }
      roleForm.value.role_resources.push({
        resource_id: menuId,
        resource_type: 0,
      });
    });
    checkedActs.value.forEach((actId) => {
      if (!roleForm.value.role_resources) {
        roleForm.value.role_resources = [];
      }
      roleForm.value.role_resources.push({
        resource_id: actId,
        resource_type: 1,
      });
    });
    if (
      roleForm.value.id?.length === 0 ||
      (roleForm.value.role_routers?.length === 0 &&
        roleForm.value.role_resources?.length === 0)
    ) {
      Message.error(t('system.role.update.fail'));
      return;
    }
    try {
      await updateRole(roleForm.value);
      Message.success(t('system.permission.update.success'));
      showDrawer.value = false;
    } catch (e) {
      Message.error(t('system.permission.update.fail'));
    }
  };
  const cancelPermission = () => {
    showDrawer.value = false;
    isPermission.value = false;
  };
  const onSelect = (rowKeys: string[]) => {
    showDelete.value = true;
    selectedRoles.value = rowKeys;
  };
  const checkboxChange = () => {
    showDelete.value = setting.checkbox && selectedRoles.value.length > 0;
  };
  const resetRoleForm = () => {
    roleForm.value = {
      id: '',
      name: '',
      description: '',
      role_resources: [],
      role_routers: [],
    };
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
        value: record.created_at as string,
      },
      {
        label: t('system.role.updatedAt'),
        value: record.updated_at as string,
      },
    ];
    Modal.open({
      title: t('system.role.title'),
      content: () => {
        return h(Descriptions, {
          data: roleDesc,
          title: t('system.role.title'),
          column: { xs: 1, md: 3, lg: 4 },
        });
      },
    });
  };

  // editInfo 编辑角色信息
  const editInfo = (record: RoleReply) => {
    isEdit.value = true;
    showModal.value = true;
    roleForm.value = {
      id: record.id,
      name: record.name,
      description: record.description,
    };
  };

  // deleteRole 删除角色信息
  const delRole = async (id: string) => {
    Modal.warning({
      title: t('system.role.delete.title'),
      content: t('system.role.delete.content'),
      onOk: async () => {
        try {
          await deleteRole(id);
          await fetchData(pagination);
        } catch (err) {
          Message.error(t('system.role.delete.fail'));
        }
      },
    });
  };

  // deleteRoles 删除多个角色
  const delRoles = () => {
    Modal.warning({
      title: t('system.role.delete.title'),
      content: t('system.role.delete.content'),
      onOk: async () => {
        try {
          await deleteRole(selectedRoles.value.join(','));
          await fetchData(pagination);
          showDelete.value = false;
        } catch (err) {
          Message.error(t('system.role.delete.fail'));
        }
      },
    });
  };

  // saveRole 保存角色信息
  const saveRole = () => {
    isEdit.value = false;
    showModal.value = true;
    resetRoleForm();
  };
  const buildCheckedMenus = (menus?: Menu[]) => {
    menus?.forEach((menu: Menu) => {
      checkedMenus.value.push(menu.id as string);
    });
  };
  const buildCheckedRouters = (routers?: Router[]) => {
    routers?.forEach((router: Router) => {
      checkedRouters.value.push(
        JSON.stringify({
          method: router.method,
          path: router.path,
        })
      );
    });
  };
  // getPermission 设置角色权限
  const getPermission = async (id: string) => {
    isPermission.value = true;
    showDrawer.value = true;
    try {
      const res1 = await getMenuTreeByRole(id);
      const res2 = await getRouterTreeByRole(id);
      const menus = res1.metadata.tree;
      const routers = res2.metadata.role_routers;
      resetRoleForm();
      checkedRouters.value = [];
      checkedMenus.value = [];
      buildCheckedRouters(routers);
      buildCheckedMenus(menus);
      roleForm.value = {
        id,
      };
    } catch (e) {
      Message.error(t('system.role.router.fail'));
      showDrawer.value = false;
    }
  };

  const menuNodeSelect = (selectedMenus: Array<string | number>) => {
    selectedMenu.value = selectedMenus[0] as string;
  };

  const handleBeforeOk = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        if (isEdit.value) {
          await updateRole(roleForm.value);
          Message.success(t('system.role.update.success'));
        } else {
          await createRole(roleForm.value);
          Message.success(t('system.role.create.success'));
        }
        await fetchData(pagination);
        done();
      } catch (e) {
        done(false);
      }
    } else {
      Message.error(t('system.form.validate.error'));
      done(false);
    }
  };
</script>

<style scoped></style>
