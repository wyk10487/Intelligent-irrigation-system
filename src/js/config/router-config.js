import Vue from 'vue';
import VueRouter from 'vue-router';
import { isAuthPage } from 'js/config/menu-config';

Vue.use(VueRouter);

const initRouter = () => {
  const routerParam = {
    mode: 'history',
    routes: [{
      path: '/login',
      name: 'Login',
      component: (resolve) => require(['components/login/index'], resolve)
    },
    {
      path: '/',
      component: (resolve) => require(['components/app/app-frame'], resolve),
      children: [{
        path: '',
        name: 'Home',
        component: (resolve) => require(['components/home/index'], resolve),
        meta: { title: '首页', icon: 'icon-monitor' }
      },
      // ----------------------------------
      // management系统设置的路由
      {
        path: 'management/account-basic',
        name: 'AccountBasic',
        component: (resolve) => require(['components/management/account-basic'], resolve),
        meta: { title: '个人中心' }
      }, {
        path: 'management/authorization',
        name: 'Authorization',
        component: (resolve) => require(['components/management/authorization'], resolve),
        meta: { title: '权限管理' }
      }, {
        path: 'management/acconut-setting/',
        name: 'AccountSetting',
        meta: { title: '账户设置' },
        component: (resolve) => require(['components/management/account-setting'], resolve),
        redirect: 'management/acconut-setting/security-setting',
        children: [{
          path: 'security-setting',
          name: 'SecuritySetting',
          component: (resolve) => require(['components/management/modules/security-setting'], resolve),
          meta: { title: '安全设置' }
        }, {
          path: 'notice-setting',
          name: 'NoticeSetting',
          component: (resolve) => require(['components/management/modules/notice-setting'], resolve),
          meta: { title: '通知设置' }
        }]
      }, {
        path: '/system-error',
        name: 'SystemError',
        component: (resolve) => require(['components/error-pages/500'], resolve),
        meta: { title: '系统错误' }
      }, {
        path: '/permission-error',
        name: 'PermissionError',
        component: (resolve) => require(['components/error-pages/403'], resolve),
        meta: { title: '权限错误' }
      },
      {
        path: '/notfound-error',
        name: 'NotfoundError',
        component: (resolve) => require(['components/error-pages/404'], resolve),
        meta: { title: '页面找不到' }
      }, {
        path: '/users',
        name: 'Users',
        component: (resolve) => require(['components/management/users'], resolve),
        meta: { title: '用户管理' }
      }, {
        path: '*',
        name: 'CommonNotfoundError',
        component: (resolve) => require(['components/error-pages/404'], resolve),
        meta: { title: '页面找不到' }
      }]
    }, {
      path: '*',
      name: 'CommonNotfoundError',
      component: (resolve) => require(['components/error-pages/404'], resolve),
      meta: { title: '页面找不到' }
    }]
  };

  let router = new VueRouter(routerParam);
  let isFirstRouter = true;

  router.beforeEach((to, from, next) => {
    if (!isFirstRouter && !isAuthPage(to.name)) {
      next({ name: 'PermissionError' });
      return;
    }
    HeyUI.$LoadingBar.start();
    log(to);
    if (to.meta && to.meta.title) {
      document.title = to.meta.title + ' - 系统应用';
    } else {
      document.title = '智慧灌溉管理系统';
    }
    isFirstRouter = false;
    next();
  });
  router.afterEach(() => {
    HeyUI.$LoadingBar.success();
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    let layoutContent = document.querySelector('.h-layout-content');
    if (layoutContent) {
      layoutContent.scrollTop = 0;
    }
  });
  return router;
};

export default initRouter;
