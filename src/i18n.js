// 国际化配置文件
import i18next from 'i18next';

// 中文翻译
const zhTranslation = {
  app: {
    name: '聚财生态基金管理系统',
    slogan: '绿色投资，智慧理财',
  },
  auth: {
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    email: '邮箱',
    confirmPassword: '确认密码',
    loginSuccess: '登录成功',
    registerSuccess: '注册成功',
    logout: '退出登录',
    forgotPassword: '忘记密码?',
  },
  nav: {
    dashboard: '仪表盘',
    funds: '基金管理',
    transactions: '交易记录',
    portfolio: '我的持仓',
    settings: '系统设置',
    profile: '个人资料',
  },
  button: {
    save: '保存',
    cancel: '取消',
    submit: '提交',
    search: '搜索',
    add: '添加',
    edit: '编辑',
    delete: '删除',
  },
  success: {
    saved: '保存成功',
    deleted: '删除成功',
    updated: '更新成功',
  },
  error: {
    required: '此字段为必填项',
    invalid: '无效输入',
    serverError: '服务器错误',
    networkError: '网络错误',
  },
  placeholder: {
    search: '搜索...',
    select: '请选择...',
  },
  date: {
    today: '今天',
    yesterday: '昨天',
    last7Days: '最近7天',
    last30Days: '最近30天',
    thisMonth: '本月',
    lastMonth: '上月',
    thisYear: '今年',
    lastYear: '去年',
  }
};

// 英文翻译
const enTranslation = {
  app: {
    name: 'Eco Fund Management System',
    slogan: 'Green Investment, Smart Finance',
  },
  auth: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    confirmPassword: 'Confirm Password',
    loginSuccess: 'Login Success',
    registerSuccess: 'Register Success',
    logout: 'Logout',
    forgotPassword: 'Forgot Password?',
  },
  nav: {
    dashboard: 'Dashboard',
    funds: 'Funds',
    transactions: 'Transactions',
    portfolio: 'Portfolio',
    settings: 'Settings',
    profile: 'Profile',
  },
  button: {
    save: 'Save',
    cancel: 'Cancel',
    submit: 'Submit',
    search: 'Search',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
  },
  success: {
    saved: 'Saved Successfully',
    deleted: 'Deleted Successfully',
    updated: 'Updated Successfully',
  },
  error: {
    required: 'This field is required',
    invalid: 'Invalid input',
    serverError: 'Server Error',
    networkError: 'Network Error',
  },
  placeholder: {
    search: 'Search...',
    select: 'Select...',
  },
  date: {
    today: 'Today',
    yesterday: 'Yesterday',
    last7Days: 'Last 7 Days',
    last30Days: 'Last 30 Days',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisYear: 'This Year',
    lastYear: 'Last Year',
  }
};

// 初始化i18n
const i18n = i18next.createInstance();

i18n
  .init({
    lng: 'zh', // 默认语言为中文
    fallbackLng: 'zh',
    resources: {
      zh: {
        translation: zhTranslation
      },
      en: {
        translation: enTranslation
      }
    },
    interpolation: {
      escapeValue: false
    },
    debug: false
  })
  .catch(err => console.error('i18n initialization error:', err));

export default i18n;