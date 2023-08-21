// 跳转登录页
export const jumpToLogin = () => {};

// localstorage信息
export const ls = {
  setDataTable: (obj) => {
    window.localStorage.setItem('dataTable', JSON.stringify(obj));
  },
  getDataTable: () => {
    return JSON.parse(window.localStorage.getItem('dataTable'));
    // window.localStorage.removeItem('dataTable')
  },
  setUserInfo: (obj) => {
    window.localStorage.setItem('userInfo', JSON.stringify(obj));
  },
  getUserInfo: () => JSON.parse(window.localStorage.getItem('userInfo')),
  setMenuList: (obj) => {
    window.localStorage.setItem('menuList', JSON.stringify(obj));
  },
  getMenuList: () => JSON.parse(window.localStorage.getItem('menuList')),
  setPermissions: (obj) => {
    window.localStorage.setItem('permissions', JSON.stringify(obj));
  },
  getPermissions: () => JSON.parse(window.localStorage.getItem('permissions')),
  setScreen: (flag) => {
    const account = ls.getUserInfo().account || '';
    window.localStorage.setItem('screen_' + account, flag);
  },
  getScreen: () => {
    const account = ls.getUserInfo().account || '';
    return window.localStorage.getItem('screen_' + account);
  },
  clear: () => {
    const keys = ['userInfo', 'menuList', 'permissions'];
    keys.forEach((e) => window.localStorage.removeItem(e));
  },
  allClear: () => window.localStorage.clear(),
  remove: (key) => window.localStorage.removeItem(key),
};

// 获取vpn前缀
// vpnWithHostname: 如果不是vpn的情况是否带hostname返回, 这个参数也就websocket用的时候为true
export const getVpnPreUrl = (url, vpnWithHostname = false) => {
  if (window.location.hostname === 'www.hnagroup.net') {
    const _AN_this_url = window._AN_this_url;
    const _AN_base_host = window._AN_base_host.replace('://', '/');
    if (vpnWithHostname) {
      return `${window.location.hostname}${_AN_this_url}${_AN_base_host}${url}`;
    }
    return `${window.location.protocol}//${window.location.hostname}${_AN_this_url}${_AN_base_host}${url}`;
  } else {
    return vpnWithHostname ? window.location.host + url : url;
  }
};

export const generateRandomId = (length = 10) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export const formatSettingsData = (data) => {
  const {
    queryField,
    queryName,
    queryType,
    queryIsRequire,
    headField,
    headName,
    headRowSpan,
    headColSpan,
    childHeadField,
    childHeadName,
    childHeadRowSpan,
    childHeadColSpan,
    settingsName,
    configDesc,
    bodyJsonConfig,
  } = data;
  let headData = [];
  let queryFormData = [];
  let childHeadData = [];
  const queryFieldAry = queryField.split(',');
  const queryNameAry = queryName.split(',');
  const queryTypeAry = queryType.split(',');
  const queryIsRequireAry = queryIsRequire.split(',');
  const headFieldAry = headField.split(',');
  const headNameAry = headName.split(',');
  const headRowSpanAry = headRowSpan.split(',');
  const headColSpanAry = headColSpan.split(',');
  const childHeadFieldAry = childHeadField.split(',').filter(i => i);
  const childHeadNameAry = childHeadName.split(',');
  const childHeadRowSpanAry = childHeadRowSpan.split(',');
  const childHeadColSpanAry = childHeadColSpan.split(',');
  queryFieldAry.forEach((_, index) => {
    queryFormData.push({
      field: queryFieldAry[index],
      name: queryNameAry[index],
      type: queryTypeAry[index],
      isRequire: queryIsRequireAry[index],
    });
  });
  headFieldAry.forEach((_, index) => {
    headData.push({
      field: headFieldAry[index],
      name: headNameAry[index],
      rowSpan: headRowSpanAry[index],
      colSpan: headColSpanAry[index],
    });
  });
  console.log('childHeadFieldAry', childHeadFieldAry)
  childHeadFieldAry.length > 0 &&
    childHeadFieldAry.forEach((_, index) => {
      childHeadData.push({
        field: childHeadFieldAry[index],
        name: childHeadNameAry[index],
        rowSpan: childHeadRowSpanAry[index],
        colSpan: childHeadColSpanAry[index],
      });
    });
    console.log('childHeadData', childHeadData)
  if (childHeadData.length > 0) {
    headData[0].children = childHeadData;
  }
  return {
    headData,
    queryFormData,
    bodyJsonConfig,
    settingsName,
    configDesc
  }
}
