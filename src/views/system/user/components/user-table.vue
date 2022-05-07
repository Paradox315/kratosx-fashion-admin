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
          :disabled="disableDeleteBtn"
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
    :data="users"
    :pagination="{
      pageSize: pageSize,
      total: total,
      current: userCurrent,
      showPageSize: true,
    }"
    @page-change="changeUserCurrent"
    @page-size-change="changePageSize"
    @select="onSelect"
  >
    <template #avatar="{ record }">
      <a-avatar shape="square" :size="80">
        <img :src="record.avatar" alt="avatar" />
      </a-avatar>
    </template>
    <template #status="{ record }">
      <span v-if="record.status" class="circle"></span>
      <span v-else class="circle pass"></span>
      {{
        record.status
          ? $t('system.table.status.enabled')
          : $t('system.table.status.disabled')
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
    v-model:visible="showModal"
    :width="600"
    unmount-on-close
    @before-ok="handleUserSubmit"
    @cancel="showModal = false"
  >
    <a-form ref="formRef" :model="userForm">
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
        <a-switch v-model="userForm.status" />
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
          @dropdown-reach-bottom="loadMoreRole"
        >
          <a-option v-for="role in roles" :key="role.id" :value="role.id">
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
  <TableSetting
    v-model:setting="setting"
    v-model:visible="showSetting"
    @check-box-change="setDeleteBatch"
  ></TableSetting>
</template>

<script lang="ts" setup>
  import { computed, h, reactive, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import {
    emailPattern,
    mobilePattern,
    usernamePattern,
    Options,
  } from '@/types/global';
  import { QueryOption, UserReply, UserRequest } from '@/api/model/user';
  import { createUser, deleteUser, getUserList, updateUser } from '@/api/user';
  import { getRoleList } from '@/api/role';
  import {
    FileItem,
    RequestOption,
  } from '@arco-design/web-vue/es/upload/interfaces';
  import { uploadFile } from '@/api/public';
  import { FormInstance } from '@arco-design/web-vue/es/form';
  import { DescData, Descriptions, Message, Modal } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import useTableSetting from '@/components/table-setting/table-setting';
  import TableSetting from '@/components/table-setting/index.vue';
  import useDeleteBatch from '@/hooks/delete-batch';
  import { usePagination } from 'vue-request';
  import { useUserStore } from '@/store';

  const { t } = useI18n();
  const { setting, showSetting, setSetting } = useTableSetting();
  const { deleteBatch, setDeleteBatch, resetDeleteBatch } = useDeleteBatch();
  const userStore = useUserStore();
  const {
    data: userData,
    current: userCurrent,
    pageSize,
    loading,
    total,
    changeCurrent: changeUserCurrent,
    changePageSize,
    refresh,
    run: searchUser,
  } = usePagination(getUserList, {
    pagination: {
      totalKey: 'metadata.total',
    },
  });
  const {
    data: roleData,
    current: roleCurrent,
    changeCurrent: changeRoleCurrent,
    totalPage,
  } = usePagination(getRoleList, {
    pagination: {
      totalKey: 'metadata.total',
    },
  });
  const loadMoreRole = async () => {
    if (roleCurrent < totalPage) {
      await changeRoleCurrent(roleCurrent.value + 1);
    }
  };
  const roles = computed(() => roleData.value?.metadata.list || []);
  const users = computed(() => userData.value?.metadata.list || []);
  const userForm = reactive<UserRequest>({});
  const fileList = ref<FileItem[]>();
  const formRef = ref<FormInstance>();
  const queryForm = ref({
    username: '',
    email: '',
    mobile: '',
    status: '',
    gender: '',
    timeSpan: [],
  });
  const showModal = ref(false);
  const isEdit = ref(false);
  const selectedUsers = ref<string[]>([]);
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
      dataIndex: 'createdAt',
    },
    {
      title: t('system.user.updateTime'),
      dataIndex: 'updatedAt',
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

  const viewInfo = (record: UserReply) => {
    const userDesc: DescData[] = [
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
        value: record.status
          ? t('system.user.status.normal')
          : t('system.user.status.disabled'),
      },
      {
        label: t('system.user.createUser'),
        value: record.creator as string,
      },
      {
        label: t('system.user.createTime'),
        value: record.createdAt as string,
      },
      {
        label: t('system.user.updateTime'),
        value: record.updatedAt as string,
      },
      {
        label: t('system.user.roles'),
        value: record.roles?.join(',') as string,
      },
    ];
    Modal.open({
      title: t('system.user.title'),
      content: () => {
        return h(Descriptions, {
          data: userDesc,
          title: t('system.user.title'),
          column: 1,
        });
      },
    });
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
      userForm.avatar = res.metadata.url;
      onSuccess(res);
    } catch (error) {
      onError(error);
    }
  };
  const saveUser = () => {
    showModal.value = true;
    isEdit.value = false;
    userForm.id = 0;
    userForm.username = '';
    userForm.nickname = '';
    userForm.email = '';
    userForm.mobile = '';
    userForm.status = true;
    userForm.roles = [];
    userForm.gender = 0;
    userForm.avatar = 'http://dummyimage.com/100x100';
    const file = {
      uid: '',
      name: 'avatar.png',
      url: 'http://dummyimage.com/100x100',
    };
    fileList.value = [file];
  };
  const onSelect = (rowKeys: string[]) => {
    selectedUsers.value = rowKeys;
  };
  const disableDeleteBtn = computed(() => {
    return selectedUsers.value.length === 0 || !deleteBatch.value;
  });
  const editInfo = (record: UserReply) => {
    showModal.value = true;
    isEdit.value = true;

    userForm.id = record.id;
    userForm.username = record.username;
    userForm.nickname = record.nickname;
    userForm.email = record.email;
    userForm.mobile = record.mobile;
    userForm.status = record.status;
    userForm.gender =
      // eslint-disable-next-line no-nested-ternary
      record.gender === '男' ? 1 : record.gender === '女' ? 2 : 0;
    userForm.roles = record.roles
      ? (record.roles.map((item) => item.id) as any)
      : [];
    userForm.avatar = record.avatar;
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
        await deleteUser(id);
        Message.success(t('system.user.delUserSuccess'));
        resetDeleteBatch();
        await refresh();
      },
    });
  };
  const delUsers = () => {
    Modal.warning({
      title: t('system.modal.user.delete.title'),
      content: t('system.modal.user.delete.content'),
      onOk: async () => {
        await deleteUser(selectedUsers.value.join(','));
        Message.success(t('system.user.delUserSuccess'));
        selectedUsers.value = [];
        resetDeleteBatch();
        await refresh();
      },
    });
  };
  const handleUserSubmit = async (done: any) => {
    const res = await formRef.value?.validate();
    if (!res) {
      try {
        loading.value = true;
        if (isEdit.value) {
          if (userForm.id === userStore.id) {
            await userStore.info();
          }
          await updateUser(userForm);
          Message.success(t('system.user.form.update'));
        } else {
          await createUser(userForm);
          Message.success(t('system.user.form.create'));
        }
        await refresh();
        done();
      } catch (err) {
        done(false);
      } finally {
        loading.value = false;
      }
    }
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
    searchUser({
      current: userCurrent.value,
      pageSize: pageSize.value,
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
</script>

<style scoped></style>
