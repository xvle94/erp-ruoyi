import request from '@/utils/request'

// 查询订单回访列表
export function listOrderVisit(query) {
  return request({
    url: '/emp/order/orderVisit/list',
    method: 'get',
    params: query
  })
}

// 查询订单回访详细
export function getOrderVisit(query) {
  return request({
    url: '/emp/order/orderVisit/info',
    method: 'get',
    params: query
  })
}

// 新增订单回访
export function addOrderVisit(data) {
  return request({
    url: '/emp/order/orderVisit',
    method: 'post',
    data: data
  })
}

// 修改订单回访
export function updateOrderVisit(data) {
  return request({
    url: '/emp/order/orderVisit',
    method: 'post',
    data: data
  })
}

// 删除订单回访
export function delOrderVisit(id) {
  return request({
    url: '/emp/order/orderVisit/' + id,
    method: 'delete'
  })
}

// 导出订单回访
export function exportOrderVisit(query) {
  return request({
    url: '/emp/order/orderVisit/export',
    method: 'get',
    params: query
  })
}

// 客户下拉框查询
export function customerAll(query) {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get',
    params: query
  })
}