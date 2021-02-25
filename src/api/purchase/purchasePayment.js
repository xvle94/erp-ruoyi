import request from '@/utils/request'

// 查询采购付款列表
export function listPurchasePayment(query) {
  return request({
    url: '/emp/purchase/payment/list',
    method: 'get',
    params: query
  })
}

// 采购付款列表-查询总付款金额
export function selectByMoney(query) {
  return request({
    url: '/emp/purchase/payment/money',
    method: 'get',
    params: query
  })
}

// 查询采购付款详细
export function getPurchasePayment(query) {
  return request({
    url: '/emp/purchase/payment/info',
    method: 'get',
    params: query
  })
}

// 新增采购付款
export function addPurchasePayment(data) {
  return request({
    url: '/emp/purchase/payment',
    method: 'post',
    data: data
  })
}

// 修改采购付款
export function updatePurchasePayment(data) {
  return request({
    url: '/emp/purchase/payment',
    method: 'put',
    data: data
  })
}

// 删除采购付款
export function delPurchasePayment(purchaseInfoId) {
  return request({
    url: '/emp/purchase/payment/' + purchaseInfoId,
    method: 'delete'
  })
}

// 导出采购付款
export function exportPurchasePayment(query) {
  return request({
    url: '/emp/purchase/payment/export',
    method: 'get',
    params: query
  })
}

// 采购明细详情
export function getPurchaseInfo(query) {
  return request({
    url: '/emp/purchase/purchaseParent/purchase/info/by',
    method: 'get',
    params: query
  })
}

// 采购付款-审核
export function examinePayment(data) {
  return request({
    url: '/emp/purchase/payment/examine',
    method: 'post',
    data: data
  })
}
// 查询采购总金额、已付款金额、未付款金额
export function queryPurchaseMoney() {
  return request({
    url: '/emp/purchase/purchaseParent/purchase/query/money',
    method: 'get'
  })
}
