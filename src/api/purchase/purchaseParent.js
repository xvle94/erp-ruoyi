import request from '@/utils/request'

// 查询采购单列表
export function listPurchaseParent(query) {
  return request({
    url: '/emp/purchase/purchaseParent/list',
    method: 'get',
    params: query
  })
}

// 获取采购金额
export function getMoney(query) {
  return request({
    url: '/emp/purchase/purchaseParent/getMoney',
    method: 'get',
    params: query
  })
}

// 查询采购单详细
export function getPurchaseParent(id) {
  return request({
    url: '/emp/purchase/purchaseParent/' + id,
    method: 'get'
  })
}

// 新增采购单
export function addPurchaseParent(data) {
  return request({
    url: '/emp/purchase/purchaseParent/saveForNotOrder',
    method: 'post',
    data: data
  })
}

// 修改采购单
export function updatePurchaseParent(data) {
  return request({
    url: '/emp/purchase/purchaseParent/updatePurchase',
    method: 'put',
    data: data
  })
}

// 删除采购单
export function delPurchaseParent(id) {
  return request({
    url: '/emp/purchase/purchaseParent/' + id,
    method: 'delete'
  })
}

// 导出采购单
export function exportPurchaseParent(query) {
  return request({
    url: '/purchase/purchaseParent/export',
    method: 'get',
    params: query
  })
}

// 获取供应商
export function getSupplier(query) {
  return request({
    url: '/emp/ozrs/supplier/getAll',
    method: 'get',
    params: query
  })
}

// 编辑回显
export function getInfo(id) {
  return request({
    url: '/emp/purchase/purchaseParent/getInfo/'+id,
    method: 'get',
  })
}

// 入库申请回显
export function getApplyInfo(id) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse/getInfoForApply/'+id,
    method: 'put',
  })
}

// 入库申请提交
export function applyForIn(query,id) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse/applyForIn/'+id,
    method: 'post',
    data: query
  })
}

// 审核通过
export function pass(data) {
  return request({
    url: '/emp/purchase/purchaseParent/pass',
    method: 'post',
    params: data
  })
}

// 审核不通过
export function notPass(data) {
  return request({
    url: '/emp/purchase/purchaseParent/notPass',
    method: 'post',
    params: data
  })
}

// 查询采购总金额、已付款金额、未付款金额
export function queryPurchaseMoney() {
  return request({
    url: '/emp/purchase/purchaseParent/purchase/query/money',
    method: 'get'
  })
}