import request from '@/utils/request'

// 查询采购开票申请列表
export function listPurchaseInvoice(query) {
  return request({
    url: '/emp/purchase/invoice/list',
    method: 'get',
    params: query
  })
}

// 采购开票申请-列表查询当前已开票金额
export function countMoney(query) {
  return request({
    url: '/emp/purchase/invoice/count/money',
    method: 'get',
    params: query
  })
}

// 查询采购开票申请详细
export function getPurchaseInvoice(id) {
  return request({
    url: '/emp/purchase/invoice/info/list/',
    method: 'get',
    params: id
  })
}

// 修改采购开票申请
export function updatePurchaseInvoice(data) {
  return request({
    url: '/emp/purchase/invoice',
    method: 'put',
    data: data
  })
}

// 删除采购开票申请
export function delPurchaseInvoice(id) {
  return request({
    url: '/emp/purchase/invoice/' + id,
    method: 'delete'
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

// 审核采购开票申请
export function toExamine(data) {
  return request({
    url: '/emp/purchase/invoice/examine',
    method: 'post',
    data: data
  })
}

// 文件上传
export function uploadFile(data) {
  return request({
    url: '/common/shiYue/upload',
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



