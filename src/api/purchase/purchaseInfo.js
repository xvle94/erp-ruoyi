import request from '@/utils/request'

// 查询采购详情列表
export function listPurchaseInfo(query) {
  return request({
    url: '/purchase/purchaseInfo/list',
    method: 'get',
    params: query
  })
}

// 查询采购详情详细
export function getPurchaseInfo(id) {
  return request({
    url: '/purchase/purchaseInfo/' + id,
    method: 'get'
  })
}

// 新增采购详情
export function addPurchaseInfo(data) {
  return request({
    url: '/purchase/purchaseInfo',
    method: 'post',
    data: data
  })
}

// 修改采购详情
export function updatePurchaseInfo(data) {
  return request({
    url: '/purchase/purchaseInfo',
    method: 'put',
    data: data
  })
}

// 删除采购详情
export function delPurchaseInfo(id) {
  return request({
    url: '/purchase/purchaseInfo/' + id,
    method: 'delete'
  })
}

// 导出采购详情
export function exportPurchaseInfo(query) {
  return request({
    url: '/purchase/purchaseInfo/export',
    method: 'get',
    params: query
  })
}