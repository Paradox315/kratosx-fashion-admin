<template>
  <a-drawer
    :visible="visible"
    :width="500"
    unmount-on-close
    :ok-loading="loading"
    @ok="savePermission"
    @cancel="setVisible(false)"
  >
    <template #title>
      {{ $t('system.role.permission.setting') }}
    </template>
    <a-tabs lazy-load>
      <a-tab-pane key="1" :title="$t('system.role.menu')">
        <a-space direction="vertical" size="large" style="width: 100%">
          <a-card :loading="menuLoading">
            <a-tree
              v-model:checked-keys="checkedObj.checkedMenus"
              block-node
              default-expand-all
              :checkable="true"
              :data="menuTree"
              @select="menuNodeSelect"
            />
          </a-card>
          <a-card v-show="getMenuAction">
            <a-checkbox-group
              v-model="checkedObj.checkedActs"
              direction="vertical"
            >
              <a-checkbox
                v-for="(act, index) of getMenuAction"
                :key="index"
                :value="act.code"
              >
                <a-space
                  >{{ act.name }} <a-tag>{{ act.code }}</a-tag></a-space
                >
              </a-checkbox>
            </a-checkbox-group>
          </a-card>
        </a-space>
      </a-tab-pane>
      <a-tab-pane key="2" :title="$t('system.role.router')">
        <a-card :loading="routerLoading">
          <a-tree
            v-model:checked-keys="checkedObj.checkedRouters"
            block-node
            default-expand-all
            :data="routerTree"
            :checkable="true"
            checked-strategy="parent"
          />
        </a-card>
      </a-tab-pane>
    </a-tabs>
  </a-drawer>
</template>

<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { Message, Tag, TreeNodeData } from '@arco-design/web-vue';
  import { Menu, MenuAction, Router, RouterGroup } from '@/api/model/resource';
  import { updateRole } from '@/api/role';
  import { RoleRequest } from '@/api/model/role';
  import { useI18n } from 'vue-i18n';
  import { ACTION_TYPE, MENU_TYPE } from '@/enums/system_enum';
  import { getMenuTree, getRouterTree } from '@/api/resource';
  import { IconQuestion } from '@arco-design/web-vue/es/icon';
  import { useVModel } from '@vueuse/core';
  import { useRequest } from 'vue-request';
  import useLoading from '@/hooks/loading';

  const { t } = useI18n();
  const props = defineProps<{
    visible: boolean;
    roleId?: string | number;
    checkedObj: {
      checkedMenus: string[];
      checkedRouters: string[];
      checkedActs: string[];
    };
  }>();
  const emit = defineEmits([
    'update:visible',
    'update:checkedObj',
    'update:roleId',
  ]);
  const visible = useVModel(props, 'visible', emit);
  const checkedObj = useVModel(props, 'checkedObj', emit);
  const roleId = useVModel(props, 'roleId', emit);
  const { loading, setLoading } = useLoading();
  const { data: routerData, loading: routerLoading } = useRequest(
    getRouterTree,
    {
      cacheKey: 'router',
      cacheTime: 300000, // 5 minutes
    }
  );
  const { data: menuData, loading: menuLoading } = useRequest(getMenuTree);
  const selectedMenu = ref<string>(''); // 获取资源部分
  const buildMenuTree = (menus?: Menu[]): TreeNodeData[] => {
    const buildChildTree = (menu: Menu): TreeNodeData => {
      return {
        title: menu.name,
        key: menu.id,
        children: menu.children?.map((child) => buildChildTree(child)),
      };
    };
    return menus?.map((menu: Menu) => buildChildTree(menu)) as TreeNodeData[];
  };
  const buildMenuAction = (menus?: Menu[]) => {
    const menuAction = new Map<string, MenuAction[]>();
    const buildChildAction = (menu: Menu) => {
      menu.children?.forEach((child) => {
        menuAction.set(child.id as string, child.actions as MenuAction[]);
        buildChildAction(child);
      });
    };
    menus?.forEach((menu: Menu) => {
      buildChildAction(menu);
    });
    return menuAction;
  };
  const buildRouterTree = (routers?: RouterGroup[]): TreeNodeData[] => {
    return routers?.map((group: RouterGroup): TreeNodeData => {
      return {
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
    }) as TreeNodeData[];
  };
  const routerTree = computed(
    () => buildRouterTree(routerData.value?.metadata?.routers) || []
  );
  const menuTree = computed(
    () => buildMenuTree(menuData.value?.metadata?.list) || []
  );
  const menuAction = computed(
    () => buildMenuAction(menuData.value?.metadata?.list) || new Map()
  );
  const roleForm = reactive<RoleRequest>({});
  const verifyRole = computed(() => {
    return (
      roleForm.id !== 0 &&
      (roleForm.routers?.length !== 0 || roleForm.resources?.length !== 0)
    );
  });
  const getMenuAction = computed(() => {
    return menuAction.value.get(selectedMenu.value);
  });
  const setVisible = (value: boolean) => {
    visible.value = value;
  };
  const menuNodeSelect = (selectedMenus: Array<string | number>) => {
    selectedMenu.value = selectedMenus[0] as string;
  };

  const resetRoleForm = () => {
    roleForm.routers = [];
    roleForm.resources = [];
  };
  // 提交表单部分
  const buildRoleForm = () => {
    resetRoleForm();
    roleForm.id = roleId.value;
    checkedObj.value.checkedRouters.forEach((router) => {
      const routerObj: Router = JSON.parse(router);
      if (!roleForm.routers) {
        roleForm.routers = [];
      }
      roleForm.routers.push(routerObj);
    });
    checkedObj.value.checkedMenus.forEach((menuId) => {
      if (!roleForm.resources) {
        roleForm.resources = [];
      }
      roleForm.resources.push({
        resourceId: menuId.toString(),
        resourceType: MENU_TYPE,
      });
    });
    checkedObj.value.checkedActs.forEach((actId) => {
      if (!roleForm.resources) {
        roleForm.resources = [];
      }
      roleForm.resources.push({
        resourceId: actId,
        resourceType: ACTION_TYPE,
      });
    });
  };

  const savePermission = async () => {
    buildRoleForm();
    if (!verifyRole.value) {
      Message.error(t('system.permission.update.fail'));
      return;
    }
    try {
      setLoading(true);
      await updateRole(roleForm);
      Message.success(t('system.permission.update.success'));
    } finally {
      setLoading(false);
    }
  };
</script>

<style scoped></style>
