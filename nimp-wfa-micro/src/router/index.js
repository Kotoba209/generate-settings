const MAIN_PATH = 'micro-app/portal/';

const routeAry = [
  { name: 'page1', path: 'list/page1', component: '@/pages/groupDemo/Table/index' },
  { name: 'base-data', path: 'list/base-data', component: '@/pages/busi-fnp/statistic-data-manager/base-data/index' },
  { name: 'generate-tp', path: 'list/generate-tp', component: '@/pages/bas-sys/wferesource/generateTp/index' },
  { name: 'settings-list', path: 'list/settings-list', component: '@/pages/bas-sys/wferesource/settingsList/index' },
];

const microRoutes = routeAry.map((i) => ({
  ...i,
  path: `${MAIN_PATH}${i.path}:query`,
}));

export default microRoutes;
