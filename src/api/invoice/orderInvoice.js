import request from '@/utils/request'

// 查询订单开票申请列表
export function listOrderInvoice(query) {
  return request({
    url: '/emp/order/invoice/list',
    method: 'get',
    params: query
  })
}

// 查询订单开票申请详细
export function getOrderInvoice(query) {
  return request({
    url: '/emp/order/invoice/info',
    method: 'get',
    params: query
  })
}

// 修改订单开票申请
export function updateOrderInvoice(data) {
  return request({
    url: '/emp/order/invoice',
    method: 'put',
    data: data
  })
}

// 删除订单开票申请
export function delOrderInvoice(orderId) {
  return request({
    url: '/emp/order/invoice/' + orderId,
    method: 'delete'
  })
}

// 导出订单开票申请
export function exportOrderInvoice(query) {
  return request({
    url: '/emp/order/invoice/export',
    method: 'get',
    params: query
  })
}


// 查询所有客户信息
export function customerAll() {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get'
  })
}

// 订单开票审核
export function updateExamine(data) {
  return request({
    url: '/emp/order/invoice/examine',
    method: 'post',
    data: data
  })
}

// 查询订单总金额、已回款、待回款金额
export function queryOrderMoney() {
  return request({
    url: '/emp/order/orderParent/order/query/money',
    method: 'get'
  })
}
