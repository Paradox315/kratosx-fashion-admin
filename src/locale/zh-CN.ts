import localeMessageBox from '@/components/message-box/locale/zh-CN';
import localeLogin from '@/views/login/locale/zh-CN';

import localeWorkplace from '@/views/dashboard/workplace/locale/zh-CN';

import localeMonitor from '@/views/dashboard/monitor/locale/zh-CN';

import localeSearchTable from '@/views/list/search-table/locale/zh-CN';
import localeCardList from '@/views/list/card/locale/zh-CN';

import localeStepForm from '@/views/form/step/locale/zh-CN';
import localeGroupForm from '@/views/form/group/locale/zh-CN';

import localeBasicProfile from '@/views/profile/basic/locale/zh-CN';

import localeSuccess from '@/views/result/success/locale/zh-CN';
import localeError from '@/views/result/error/locale/zh-CN';

import locale403 from '@/views/exception/403/locale/zh-CN';
import locale404 from '@/views/exception/404/locale/zh-CN';
import locale500 from '@/views/exception/500/locale/zh-CN';

import localeUserInfo from '@/views/user/info/locale/zh-CN';
import localeUserSetting from '@/views/user/setting/locale/zh-CN';

import localeSystemUser from '@/views/system/user/locale/zh-CN';
import localeSystemRole from '@/views/system/role/locale/zh-CN';
import localeSystemMenu from '@/views/system/menu/locale/zh-CN';
import localeSystemPermission from '@/views/system/permission/locale/zh-CN';

import localeIcon from '@/components/icon-picker/locale/zh-CN';
import localeSettings from './zh-CN/settings';

export default {
  'menu.dashboard': '仪表盘',
  'menu.list': '列表页',
  'menu.result': '结果页',
  'menu.exception': '异常页',
  'menu.form': '表单页',
  'menu.profile': '详情页',
  'menu.visualization': '数据可视化',
  'menu.user': '个人中心',
  'menu.system': '系统管理',
  'navbar.docs': '文档中心',
  'navbar.action.locale': '切换为中文',
  'http.status.BadRequest': '请求错误',
  'http.status.Unauthorized': '未授权,请重新登录',
  'http.status.Forbidden': '拒绝访问',
  'http.status.NotFound': '资源未找到',
  'http.status.MethodNotAllowed': '请求方法不被允许',
  'http.status.Timeout': '请求超时',
  'http.status.InternalServerError': '服务器内部错误',
  'http.status.BadGateway': '网关错误',
  'http.status.ServiceUnavailable': '服务不可用',
  'http.status.UnknownError': '未知错误',
  ...localeSettings,
  ...localeMessageBox,
  ...localeLogin,
  ...localeWorkplace,
  ...localeIcon,

  ...localeMonitor,
  ...localeSearchTable,
  ...localeCardList,
  ...localeStepForm,
  ...localeGroupForm,
  ...localeBasicProfile,
  ...localeSuccess,
  ...localeError,
  ...locale403,
  ...locale404,
  ...locale500,
  ...localeUserInfo,
  ...localeUserSetting,
  ...localeSystemUser,
  ...localeSystemRole,
  ...localeSystemMenu,
  ...localeSystemPermission,
};
