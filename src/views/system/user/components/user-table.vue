<template>
  <a-row>
    <a-col :flex="1">
      <a-form
        :model="queryForm"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
      >
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="username" :label="$t('system.user.username')">
              <a-input
                v-model="queryForm.username"
                :placeholder="$t('system.user.form.username.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="email" :label="$t('system.user.email')">
              <a-input
                v-model="queryForm.email"
                :placeholder="$t('system.user.form.email.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="mobile" :label="$t('system.user.mobile')">
              <a-input
                v-model="queryForm.mobile"
                :placeholder="$t('system.user.form.mobile.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="status" :label="$t('system.user.status')">
              <a-select
                v-model="queryForm.status"
                :options="statusOptions"
                :placeholder="$t('system.user.form.status.placeholder')"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="timeSpan" :label="$t('system.user.createTime')">
              <a-range-picker
                v-model="queryForm.timeSpan"
                style="width: 100%"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="gender" :label="$t('system.user.gender')">
              <a-select
                v-model="queryForm.gender"
                :options="genderOptions"
                :placeholder="$t('system.user.form.gender.placeholder')"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider style="height: 84px" direction="vertical" />
    <a-col :flex="'86px'" style="text-align: right">
      <a-space direction="vertical" :size="18">
        <a-button type="primary" :loading="loading" @click="search">
          <template #icon>
            <icon-search />
          </template>
          {{ $t('searchTable.form.search') }}
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <icon-refresh />
          </template>
          {{ $t('searchTable.form.reset') }}
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 0" />
  <a-row style="margin-bottom: 16px">
    <a-col :span="16">
      <a-space>
        <a-button type="primary" @click="saveUser">
          <template #icon>
            <icon-plus />
          </template>
          {{ $t('system.table.create') }}
        </a-button>
        <a-button
          type="text"
          status="danger"
          :disabled="!showDelete"
          @click="delUsers"
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
    <template #avatar="{ record }">
      <a-avatar shape="square" :size="80">
        <img :src="record.avatar" alt="avatar" />
      </a-avatar>
    </template>
    <template #status="{ record }">
      <span v-if="record.status === 2" class="circle"></span>
      <span v-else-if="record.status === 1" class="circle pass"></span>
      {{
        record.status === 2
          ? $t('system.table.status.disabled')
          : $t('system.table.status.enabled')
      }}
    </template>
    <template #roles="{ record }">
      <a-space direction="vertical">
        <a-tag v-for="role in record.roles" :key="role.id">
          {{ role.name }}
        </a-tag>
      </a-space>
    </template>
    <template #optional="{ record }">
      <a-space>
        <a-button @click="viewInfo(record)"
          >{{ $t('system.table.view') }}
        </a-button>
        <a-button type="primary" @click="editInfo(record)"
          >{{ $t('system.table.edit') }}
        </a-button>
        <a-button status="danger" type="primary" @click="delUser(record.id)"
          >{{ $t('system.table.delete') }}
        </a-button>
      </a-space>
    </template>
  </a-table>
  <a-modal
    v-model:visible="visible"
    :width="600"
    unmount-on-close
    @before-ok="handleBeforeOk"
    @cancel="handleCancel"
  >
    <template #title>{{ $t('system.user.description') }}</template>
    <a-descriptions
      v-if="modalType === 0"
      :data="userDesc"
      :title="$t('system.user.title')"
      :column="{ xs: 1, md: 3, lg: 4 }"
    >
      <a-descriptions-item
        v-for="item of userDesc"
        :key="item.label"
        :label="item.label"
      >
        <a-space v-if="item.label === $t('system.user.roles')">
          <a-tag v-for="role in item.value" :key="role.id">
            {{ role.name }}
          </a-tag>
        </a-space>
        <span v-else>
          {{ item.value }}
        </span>
      </a-descriptions-item>
    </a-descriptions>
    <a-form v-else ref="formRef" :model="userForm">
      <a-form-item
        field="username"
        :label="$t('system.user.username')"
        :rules="[
          {
            required: true,
            message: $t('system.user.form.username.required'),
          },
          {
            match: usernamePattern,
            message: $t('system.user.form.username.match'),
          },
        ]"
      >
        <a-input
          v-model="userForm.username"
          :placeholder="$t('system.user.form.username.placeholder')"
        />
      </a-form-item>
      <a-form-item
        v-if="modalType === 2"
        field="password"
        :label="$t('system.user.password')"
        :rules="[
          {
            required: true,
            message: $t('system.user.form.password.required'),
          },
        ]"
      >
        <a-input-password
          v-model="userForm.password"
          :placeholder="$t('system.user.form.password.placeholder')"
          allow-clear
        >
        </a-input-password>
      </a-form-item>
      <a-form-item field="nickname" :label="$t('system.user.nickname')">
        <a-input
          v-model="userForm.nickname"
          :placeholder="$t('system.user.form.nickname.placeholder')"
        />
      </a-form-item>
      <a-form-item
        field="email"
        :label="$t('system.user.email')"
        :rules="[
          {
            required: true,
            message: $t('system.user.form.email.required'),
          },
          {
            match: emailPattern,
            message: $t('userSetting.basicInfo.form.error.email'),
          },
        ]"
      >
        <a-input
          v-model="userForm.email"
          :placeholder="$t('system.user.form.email.placeholder')"
        />
      </a-form-item>
      <a-form-item
        field="mobile"
        :label="$t('system.user.mobile')"
        :rules="[
          {
            required: true,
            message: $t('system.user.form.mobile.required'),
          },
          {
            match: mobilePattern,
            message: $t('userSetting.basicInfo.form.error.mobile'),
          },
        ]"
      >
        <a-input
          v-model="userForm.mobile"
          :placeholder="$t('system.user.form.mobile.placeholder')"
        />
      </a-form-item>
      <a-form-item field="gender" :label="$t('system.user.gender')">
        <a-radio-group v-model="userForm.gender" type="button">
          <a-radio :value="0"
            >{{ $t('userSetting.basicInfo.form.label.unknown') }}
          </a-radio>
          <a-radio :value="1"
            >{{ $t('userSetting.basicInfo.form.label.male') }}
          </a-radio>
          <a-radio :value="2"
            >{{ $t('userSetting.basicInfo.form.label.female') }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="status" :label="$t('system.user.status')">
        <a-switch
          v-model="userForm.status"
          :checked-value="1"
          :unchecked-value="2"
        />
      </a-form-item>
      <a-form-item
        field="roles"
        :label="$t('system.user.roles')"
        :rules="[
          { required: true, message: $t('system.user.form.roles.required') },
        ]"
      >
        <a-select
          v-model="userForm.roles"
          :style="{ width: '360px' }"
          :field-names="{ value: 'id', label: 'name' }"
          :placeholder="$t('system.user.form.roles.placeholder')"
          multiple
          @dropdown-reach-bottom="loadMoreRoles"
        >
          <a-option v-for="role in roleList" :key="role.id" :value="role.id">
            {{ role.name }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="avatar" :label="$t('system.user.avatar')">
        <a-upload
          :custom-request="uploadAvatar"
          list-type="picture-card"
          accept="image/png,image/jpg"
          :file-list="fileList"
          :show-upload-button="true"
          :show-file-list="false"
          @change="uploadChange"
        >
          <template #upload-button>
            <a-avatar :size="100" shape="square">
              <template #trigger-icon>
                <icon-camera />
              </template>
              <img v-if="fileList.length" :src="fileList[0].url" />
            </a-avatar>
            <a-progress
              v-if="
                fileList[0].status === 'uploading' && fileList[0].percent < 100
              "
              :percent="fileList[0].percent"
              type="circle"
              size="mini"
              :style="{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translateX(-50%) translateY(-50%)',
              }"
            />
          </template>
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-drawer
    :visible="showSetting"
    :width="500"
    :footer="false"
    unmount-on-close
    @ok="saveSetting"
    @cancel="cancelSetting"
  >
    <template #title> {{ $t('system.table.setting') }} </template>
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
  import { computed, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    Pagination,
    emailPattern,
    mobilePattern,
    usernamePattern,
    Options,
  } from '@/types/global';
  import { RoleReply } from '@/types/role';
  import {
    ListSearchRequest,
    QueryOption,
    UserReply,
    UserRequest,
    UserRole,
  } from '@/types/user';
  import useLoading from '@/hooks/loading';
  import { createUser, deleteUser, getUserList, updateUser } from '@/api/user';
  import { getRoleList } from '@/api/role';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { uploadFile } from '@/api/public';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';

  const { t } = useI18n();
  const { loading, setLoading } = useLoading(true);
  const fileList = ref<FileItem[]>();
  const formRef = ref<FormInstance>();
  const renderData = ref<UserReply[] | undefined>([]);
  const userForm = ref<UserRequest>({});
  const queryForm = ref({
    username: '',
    email: '',
    mobile: '',
    status: '',
    gender: '',
    timeSpan: [],
  });
  const userDesc = ref([
    {
      label: t('system.user.username'),
      value: '',
    },
    {
      label: t('system.user.nickname'),
      value: '',
    },
    {
      label: t('system.user.email'),
      value: '',
    },
    {
      label: t('system.user.mobile'),
      value: '',
    },
    {
      label: t('system.user.status'),
      value: '',
    },
    {
      label: t('system.user.createUser'),
      value: '',
    },
    {
      label: t('system.user.createTime'),
      value: '',
    },
    {
      label: t('system.user.updateTime'),
      value: '',
    },
    {
      label: t('system.user.roles'),
      value: Array<UserRole>(0),
    },
  ]);
  const visible = ref(false);
  const showSetting = ref(false);
  const showDelete = ref(false);
  const modalType = ref(0);
  const roleList = ref<RoleReply[] | undefined>([]);
  const selectedUsers = ref<string[]>([]);
  const basePagination: Pagination = {
    current: 1,
    pageSize: 10,
  };
  const pagination = reactive({
    ...basePagination,
  });
  const rolePagination = reactive({
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
  const columns = [
    {
      title: t('system.user.id'),
      dataIndex: 'id',
      fixed: 'left',
      width: 50,
    },
    {
      title: t('system.user.avatar'),
      dataIndex: 'avatar',
      slotName: 'avatar',
    },
    {
      title: t('system.user.username'),
      dataIndex: 'username',
    },
    {
      title: t('system.user.nickname'),
      dataIndex: 'nickname',
    },
    {
      title: t('system.user.roles'),
      dataIndex: 'roles',
      slotName: 'roles',
    },
    {
      title: t('system.user.email'),
      dataIndex: 'email',
    },
    {
      title: t('system.user.mobile'),
      dataIndex: 'mobile',
    },
    {
      title: t('system.user.status'),
      dataIndex: 'status',
      slotName: 'status',
    },
    {
      title: t('system.user.gender'),
      dataIndex: 'gender',
      slotName: 'gender',
    },
    {
      title: t('system.user.createUser'),
      dataIndex: 'creator',
    },
    {
      title: t('system.user.createTime'),
      dataIndex: 'created_at',
    },
    {
      title: t('system.user.updateTime'),
      dataIndex: 'updated_at',
    },
    {
      title: t('system.table.actions'),
      slotName: 'optional',
      fixed: 'right',
      width: 220,
    },
  ];
  const rowSelection = reactive({
    type: 'checkbox',
    showCheckedAll: false,
  });
  const statusOptions = computed<Options[]>(() => [
    {
      label: t('system.table.status.enabled'),
      value: '1',
    },
    {
      label: t('system.table.status.disabled'),
      value: '2',
    },
  ]);
  const genderOptions = computed<Options[]>(() => [
    {
      label: t('system.user.gender.unknown'),
      value: '0',
    },
    {
      label: t('system.user.gender.female'),
      value: '1',
    },
    {
      label: t('system.user.gender.male'),
      value: '2',
    },
  ]);
  const fetchData = async (
    params: ListSearchRequest = { page_num: 1, page_size: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await getUserList(params);
      renderData.value = res.metadata.list;
      pagination.total = res.metadata.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const fetchRole = async (
    params: Pagination = { current: 1, pageSize: 10 }
  ) => {
    setLoading(true);
    try {
      const res = await getRoleList(params);
      roleList.value = res.metadata.list;
      rolePagination.current = params.current;
      rolePagination.total = res.metadata.total;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
  fetchRole();
  // eslint-disable-next-line camelcase
  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchData({ page_num: pagination.current, page_size: pagination.pageSize });
  };
  const loadMoreRoles = () => {
    rolePagination.total = rolePagination.total as number;
    if (
      rolePagination.current * rolePagination.pageSize >=
      rolePagination.total
    ) {
      return;
    }
    rolePagination.current += 1;
    fetchRole(rolePagination);
  };

  const viewInfo = (record: UserReply) => {
    visible.value = true;
    modalType.value = 0;
    userDesc.value = [
      {
        label: t('system.user.username'),
        value: record.username as string,
      },
      {
        label: t('system.user.nickname'),
        value: record.nickname as string,
      },
      {
        label: t('system.user.email'),
        value: record.email as string,
      },
      {
        label: t('system.user.mobile'),
        value: record.mobile as string,
      },
      {
        label: t('system.user.status'),
        value:
          // eslint-disable-next-line no-nested-ternary
          record.status === 1
            ? t('system.user.status.normal')
            : record.status === 2
            ? t('system.user.status.disabled')
            : t('system.user.status.unknown'),
      },
      {
        label: t('system.user.createUser'),
        value: record.creator as string,
      },
      {
        label: t('system.user.createTime'),
        value: record.created_at as string,
      },
      {
        label: t('system.user.updateTime'),
        value: record.updated_at as string,
      },
      {
        label: t('system.user.roles'),
        value: record.roles ? record.roles : Array<UserRole>(0),
      },
    ];
  };
  const uploadChange = (fileItemList: FileItem[], fileItem: FileItem) => {
    fileList.value = [fileItem];
  };
  const uploadAvatar = async (options: RequestOption) => {
    const { onProgress, onError, onSuccess, fileItem, name = 'file' } = options;
    onProgress(20);
    const formData = new FormData();
    formData.append(name as string, fileItem.file as Blob);
    const onUploadProgress = (event: ProgressEvent) => {
      let percent;
      if (event.total > 0) {
        percent = (event.loaded / event.total) * 100;
      }
      onProgress(parseInt(String(percent), 10), event);
    };
    try {
      const res = await uploadFile(formData, onUploadProgress);
      userForm.value.avatar = res.metadata.url;
      onSuccess(res);
    } catch (error) {
      onError(error);
    }
  };
  const saveUser = () => {
    visible.value = true;
    modalType.value = 2;
    userForm.value = {
      id: '',
      username: '',
      password: '123456',
      nickname: '',
      email: '',
      mobile: '',
      status: 1,
      gender: 0,
      roles: [],
      avatar: 'http://dummyimage.com/100x100',
    };
    const file = {
      uid: '',
      name: 'avatar.png',
      url: 'http://dummyimage.com/100x100',
    };
    fileList.value = [file];
  };
  const editInfo = (record: UserReply) => {
    visible.value = true;
    modalType.value = 1;
    userForm.value = {
      id: record.id,
      username: record.username,
      nickname: record.nickname,
      email: record.email,
      mobile: record.mobile,
      status: record.status,
      // eslint-disable-next-line no-nested-ternary
      gender: record.gender === '男' ? 1 : record.gender === '女' ? 2 : 0,
      roles: record.roles ? (record.roles.map((item) => item.id) as any) : [],
      avatar: record.avatar,
    };
    const file = {
      uid: '',
      name: 'avatar.png',
      url: record.avatar,
    };
    fileList.value = [file];
  };
  const delUser = (id: string) => {
    Modal.warning({
      title: t('system.modal.user.delete.title'),
      content: t('system.modal.user.delete.content'),
      onOk: async () => {
        try {
          await deleteUser(id);
          Message.success(t('system.user.delUserSuccess'));
          await fetchData({
            page_num: pagination.current,
            page_size: pagination.pageSize,
          });
        } catch (error) {
          Message.error(t('system.user.delUserFailed'));
        }
      },
    });
  };
  const delUsers = () => {
    Modal.warning({
      title: t('system.modal.user.delete.title'),
      content: t('system.modal.user.delete.content'),
      onOk: async () => {
        try {
          await deleteUser(selectedUsers.value.join(','));
          Message.success(t('system.user.delUserSuccess'));
          await fetchData({
            page_num: pagination.current,
            page_size: pagination.pageSize,
          });
          showDelete.value = false;
        } catch (error) {
          Message.error(t('system.user.delUserFailed'));
        }
      },
    });
  };
  const handleBeforeOk = async (done: any) => {
    if (modalType.value === 0) {
      done();
      return;
    }
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        if (modalType.value === 1) {
          await updateUser(userForm.value);
          Message.success(t('system.user.form.update'));
        } else if (modalType.value === 2) {
          await createUser(userForm.value);
          Message.success(t('system.user.form.create'));
        }
        done();
        await fetchData({
          page_num: pagination.current,
          page_size: pagination.pageSize,
        });
      } catch (err) {
        done(false);
      }
    } else {
      done(false);
      Message.error(t('system.form.validate.error'));
    }
  };
  const handleCancel = () => {
    visible.value = false;
  };
  const buildQuery = () => {
    const queryOpts: Array<QueryOption> = [];
    if (queryForm.value.username !== '') {
      queryOpts.push({
        field: 'username',
        value: queryForm.value.username,
        opt: 'LIKE',
      });
    }
    if (queryForm.value.email !== '') {
      queryOpts.push({
        field: 'email',
        value: queryForm.value.email,
        opt: 'EQ',
      });
    }
    if (queryForm.value.mobile !== '') {
      queryOpts.push({
        field: 'mobile',
        value: queryForm.value.mobile,
        opt: 'EQ',
      });
    }
    if (queryForm.value.status !== '') {
      queryOpts.push({
        field: 'status',
        value: queryForm.value.status,
        opt: 'EQ',
      });
    }
    if (queryForm.value.timeSpan && queryForm.value.timeSpan.length > 0) {
      const { timeSpan } = queryForm.value;
      const startTime = dayjs(timeSpan[0]).format('YYYY-MM-DD HH:mm:ss');
      const endTime = dayjs(timeSpan[1]).format('YYYY-MM-DD HH:mm:ss');
      queryOpts.push({
        field: 'created_at',
        interval: {
          from: startTime,
          to: endTime,
        },
        opt: 'BETWEEN',
      });
    }
    if (queryForm.value.gender !== '') {
      queryOpts.push({
        field: 'gender',
        value: queryForm.value.gender,
        opt: 'EQ',
      });
    }
    return queryOpts;
  };
  const search = () => {
    const queryOptions = buildQuery();
    fetchData({
      page_num: pagination.current,
      page_size: pagination.pageSize,
      query: queryOptions,
    });
  };
  const reset = () => {
    queryForm.value = {
      username: '',
      email: '',
      mobile: '',
      status: '',
      gender: '',
      timeSpan: [],
    };
  };
  const openSetting = () => {
    showSetting.value = true;
  };
  const saveSetting = () => {
    showSetting.value = false;
  };
  const cancelSetting = () => {
    showSetting.value = false;
  };
  const onSelect = (rowKeys: string[]) => {
    showDelete.value = true;
    selectedUsers.value = rowKeys;
  };
  const checkboxChange = () => {
    showDelete.value = setting.checkbox && selectedUsers.value.length > 0;
  };
</script>

<style scoped></style>
