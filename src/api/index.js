import request from '@/utils/request'

// 查询销售统计
export function getSalesTotal(query){
  return request({
    url: '/emp/base/index/getTop',
    method: 'get',
    params: query
  })
}

// 销售金额统计
export function getSalesAmount(query){
  return request({
    url: '/emp/base/index/getTopLeft',
    method: 'get',
    params: query
  })
}

// 待办事项
export function getBackLog(query){
  return request({
    url: '/emp/base/index/getTopRight',
    method: 'get',
    params: query
  })
}

// 销售订单统计
export function getOrderStatistics(query){
  return request({
    url: '/emp/base/index/getBottomLeft',
    method: 'get',
    params: query
  })
}

// 采购统计
export function getPurchaseStatistics(query){
  return request({
    url: '/emp/base/index/getBottomRight',
    method: 'get',
    params: query
  })
}

// 应收应付统计
export function getARAP(query){
  return request({
    url: '/emp/base/index/getBottom',
    method: 'get',
    params: query
  })
}

// 获取登录用户的角色
export function getRole(query){
  return request({
    url: '/system/role/getLoginRole',
    method: 'get',
    params: query
  })
}

// 获取登录用户的角色获取待办事项
export function getBackLogByRole(query){
  return request({
    url: '/emp/base/index/getTodo',
    method: 'get',
    params: query
  })
}

// 导出
export function getExport(query){
  return request({
    url: '/emp/base/index/bottomExport',
    method: 'get',
    params: query
  })
}
