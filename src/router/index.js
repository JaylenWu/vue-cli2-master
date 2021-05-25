import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ExcelImport',
      component: () => import('@/view/upload-demo/index.vue')
    },
    {
      path: '/excel-import',
      name: 'ExcelImport',
      component: () => import('@/view/excel-import/index.vue')
    },
    // {
    //   path: '/upload-demo',
    //   name: 'UploadDemo',
    //   component: () => import('@/view/upload-demo/index.vue')
    // }
  ]
})
