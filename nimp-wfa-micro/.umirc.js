import { defineConfig } from 'umi';
import microRoutes from './src/router';

const path = require('path');

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  publicPath: '/nimp-wfa-micro/',
  base: '/nimp-wfa-micro/',
  plugins: ['@alitajs/keep-alive'],
  qiankun: {
    slave: {},
  },
  routes: [
    {
      path: 'main',
      component: '@/layouts/index',
      routes: [...microRoutes],
    },
  ],
  keepalive: [...microRoutes.map((i) => `/main/${i.path}`)],
  proxy: {
    '/socket': {
      target: 'ws://localhost:3000', //后端目标接口地址
      changeOrigin: true, //是否允许跨域
      pathRewrite: {
        '^/socket': '', //重写,
      },
      ws: true, //开启ws, 如果是http代理此处可以不用设置
    },
    '/node-serve': {
      target: 'http://localhost:3001/',
      changeOrigin: true,
      pathRewrite: { '^/node-serve': '' },
    },
  },
  dva: {},
  request: {},
  fastRefresh: {},
  mock: {
    // 注释这段代码启用菜单mock模式
    // exclude: ['mock/menuList.js']
  },
});
