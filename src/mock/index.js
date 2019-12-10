import users from './users';
const Mock = require('mockjs');

Mock.setup({
  timeout: 0 - 300
});

Mock.mock('/api/account/info', 'get', {
  'status': 200,
  'body': {
    name: 'wyk',
    desc: '超级管理员',
    id: 'M201873752',
    email: '773538775@qq.com',
    mobile: '18007125792',
    org: '北京嘀嘀无限科技有限公司',
    dept: '金融部',
    title: '前端开发工程师',
    location: '北京市'
  }
});

Mock.mock('/api/dict', 'get', {
  'status': 200,
  'body': [{
    'name': 'simple',
    'data': {
      '1': '苹果',
      '2': '梨子',
      '3': '香蕉',
      '4': '橙子',
      '5': '樱桃'
    }
  }]
});

Mock.mock('/api/login', 'post', {
  'status': 200,
  'body': {
    'value': 'test'
  }
});

Mock.mock('/api/logout', 'post', {
  'status': 200
});

Mock.mock('/api/home/messages', 'get', {
  'status': 200,
  'body': [{
    'id': 1,
    'isReaded': false,
    'title': '任务名称1',
    'description': '你需要在某年某月完成某某任务'
  }, {
    'id': 2,
    'isReaded': false,
    'title': '任务名称2',
    'description': '你需要在某年某月完成某某任务'
  }, {
    'id': 3,
    'isReaded': true,
    'title': '任务名称3',
    'description': '你需要在某年某月完成某某任务'
  }, {
    'id': 4,
    'isReaded': true,
    'title': '任务名称4',
    'description': '你需要在某年某月完成某某任务'
  }, {
    'id': 5,
    'isReaded': true,
    'title': '任务名称5',
    'description': '你需要在某年某月完成某某任务'
  }]
});

Mock.mock('/api/management/users', 'get', { status: 200, body: users });

Mock.mock('/api/management/roles', 'get', {
  'status': 200,
  'body': [{
    id: 1,
    name: '系统管理员',
    description: '最高权限，可操作任何页面和功能'
  }, {
    id: 2,
    name: '普通员工',
    description: '普通员工'
  }, {
    id: 3,
    name: 'Leader',
    description: '可进行团队数据查看，可导出数据'
  }]
});
