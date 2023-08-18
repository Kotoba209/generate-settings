// 运行时配置
import { getDvaApp, /* patchKeepAlive, */ /* dropByCacheKey */ dropByCacheKey, } from 'umi';
import './public-path';
import actions from './plugins/quankun';

// const { getCachingNodes, dropScope } = useAliveController();

// 主应用创建共享状态：
const storeChange = async (props) => {
  // 将主应用传递参数存储
  actions.setActions(props);
  // 微应用通过 props 获取共享状态并监听
  props.onGlobalStateChange &&
    // props.onGlobalStateChange()方法就是用来监听主应用传值，value是在主应用中传过来的值，每当主应用中调用setGlobalState()方法改变值的时候，在这里都可以监听到最新的值
    (await props.onGlobalStateChange(async (values) => {
      console.log(values, 'values');
      // 关掉的 tab，解除状态保持
      const { delMicroUrls } = values;
      delMicroUrls.map(i => {
        dropByCacheKey(i)
      })
      // dva 状态管理
      const timer = setTimeout(() => {
        getDvaApp()._store.dispatch({
          type: 'global/updateMainParams',
          payload: values,
        });
        clearTimeout(timer);
      }, 10);
    }, true));
};

export const qiankun = {
  // 应用加载之前
  async bootstrap(props) {
    console.log('app bootstrap', props);
  },
  // 应用 render 之前触发
  async mount(props) {
    console.log('app mount', props);
    await storeChange(props);
  },
  // 应用卸载之后触发
  async unmount(props) {
    console.log('app unmount', props);
    props.offGlobalStateChange && props.offGlobalStateChange();
  },
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState() {
//   return { name: '@umijs/max' };
// }

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false,
//     },
//   };
// };
