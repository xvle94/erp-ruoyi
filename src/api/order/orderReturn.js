import request from '@/utils/request'

// 查询订单回款列表
export function listOrderReturn(query) {
  return request({
    url: '/emp/order/orderReturn/list',
    method: 'get',
    params: query
  })
}

// 查询订单回款详细
export function getOrderReturn(orderId) {
  return request({
    url: '/emp/order/orderReturn/' + orderId,
    method: 'get'
  })
}

// 新增订单回款
export function addOrderReturn(data) {
  return request({
    url: '/order/orderReturn',
    method: 'post',
    data: data
  })
}

// 修改订单回款
export function updateOrderReturn(data) {
  return request({
    url: '/emp/order/orderReturn',
    method: 'post',
    data: data
  })
}

// 删除订单回款
export function delOrderReturn(orderId) {
  return request({
    url: '/emp/order/orderReturn/'+orderId,
    method: 'delete',
  })
}

// 导出订单回款
export function exportOrderReturn(query) {
  return request({
    url: '/emp/order/orderReturn/export',
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

// 根据时间查询已回款总金额
export function getTotalMoney(query) {
  return request({
    url: '/emp/order/orderReturn/money/by/time',
    method: 'get',
    params: query
  })
}

// 查询订单总金额、已回款、待回款金额
export function queryOrderMoney() {
  return request({
    url: '/emp/order/orderParent/order/query/money',
    method: 'get'
  })
}