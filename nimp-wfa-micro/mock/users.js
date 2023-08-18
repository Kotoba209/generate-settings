import mockjs from 'mockjs';

export default {
  'GET /api/users': { users: [1, 2] },
  'GET /api/list': mockjs.mock({
    'data|10': [{ id: '@id', title: '@name', description: '@cparagraph(2)' }],
  }),
};
