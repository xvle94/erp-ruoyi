import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                   // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true               // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect           // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'             // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
    roles: ['admin','editor']    // 设置该路由进入的权限，支持多个权限叠加
    title: 'title'               // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'             // 设置该路由的图标，对应路径src/icons/svg
    breadcrumb: false            // 如果设置为false，则不会在breadcrumb面包屑中显示
  }
 */

// 公共路由
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: (resolve) => require(['@/views/redirect'], resolve)
      }
    ]
  },
  {
    path: '/login',
    component: (resolve) => require(['@/views/login'], resolve),
    hidden: true
  },
  {
    path: '/404',
    component: (resolve) => require(['@/views/error/404'], resolve),
    hidden: true
  },
  {
    path: '/401',
    component: (resolve) => require(['@/views/error/401'], resolve),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        component: (resolve) => require(['@/views/index'], resolve),
        name: '首页',
        meta: { title: '首页', icon: 'dashboard', noCache: true, affix: true }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile',
        component: (resolve) => require(['@/views/system/user/profile/index'], resolve),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  {
    path: '/dict',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'type/data/:dictId(\\d+)',
        component: (resolve) => require(['@/views/system/dict/data'], resolve),
        name: 'Data',
        meta: { title: '字典数据', icon: '' }
      }
    ]
  },
  {
    path: '/job',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'log',
        component: (resolve) => require(['@/views/monitor/job/log'], resolve),
        name: 'JobLog',
        meta: { title: '调度日志' }
      }
    ]
  },
  {
    path: '/gen',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'edit/:tableId(\\d+)',
        component: (resolve) => require(['@/views/tool/gen/editTable'], resolve),
        name: 'GenEdit',
        meta: { title: '修改生成配置' }
      }
    ]
  },
  //流程定义打开所属节点页面
  {
    path: '/process',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'definition/node/:definitionId(\\d+)',
        component: (resolve) => require(['@/views/process/definition/node'], resolve),
        name: 'Node',
        meta: { title: '流程节点数据', icon: '' }
      }
    ]
  },
  //详情
  {
    path: '/detail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'detail',
        component: (resolve) => require(['@/views/repair/schoolIn/detail/index'], resolve),
        name: 'detail',
        meta: { title: '详情' }
      }
    ]
  },
  // 订单新增
  {
    path: '/order',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'orderAdd',
        component: (resolve) => require(['@/views/order/orderParent/orderHandle'], resolve),
        name: 'orderAdd',
        meta: { title: '订单操作', icon: '' }
      }
    ]
  },
  // 订单采购
  {
    path: '/order',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'purchase',
        component: (resolve) => require(['@/views/order/orderParent/purchase'], resolve),
        name: 'purchase',
        meta: { title: '我要采购', icon: '' }
      }
    ]
  },
  // 订单发货
  {
    path: '/order',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'delivery',
        component: (resolve) => require(['@/views/order/orderParent/delivery'], resolve),
        name: 'delivery',
        meta: { title: '我要出库', icon: '' }
      }
    ]
  },
  //采购新增编辑
  {
    path: '/purchaseEdit',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'purchaseEdit',
        component: (resolve) => require(['@/views/purchase/purchaseAdd/index'], resolve),
        name: 'purchaseEdit',
        meta: { title: '采购操作' }
      }
    ]
  },
  //采购详情
  {
    path: '/purchaseDetail',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'purchaseDetail',
        component: (resolve) => require(['@/views/purchase/purchaseDetail/index'], resolve),
        name: 'purchaseDetail',
        meta: { title: '详情' }
      }
    ]
  },
  //采购申请
  {
    path: '/purchaseApply',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'purchaseApply',
        component: (resolve) => require(['@/views/purchase/purchaseApply/index'], resolve),
        name: 'purchaseApply',
        meta: { title: '申请' }
      }
    ]
  },
  //采购审核
  {
    path: '/purchaseExamine',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'purchaseExamine',
        component: (resolve) => require(['@/views/purchase/purchaseExamine/index'], resolve),
        name: 'purchaseExamine',
        meta: { title: '审核' }
      }
    ]
  },
]

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})
