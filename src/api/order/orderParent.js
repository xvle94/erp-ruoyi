import request from '@/utils/request'

// 查询订单列表
export function listOrderParent(query) {
  return request({
    url: '/emp/order/orderParent/list',
    method: 'get',
    params: query
  })
}

// 查询订单详细
export function getOrderParent(id) {
  return request({
    url: '/emp/order/orderParent/' + id,
    method: 'get'
  })
}

// 新增订单
export function addOrderParent(data) {
  return request({
    url: '/emp/order/orderParent',
    method: 'post',
    data: data
  })
}

// 修改订单
export function updateOrderParent(data) {
  return request({
    url: '/emp/order/orderParent',
    method: 'put',
    data: data
  })
}

// 删除订单
export function delOrderParent(id) {
  return request({
    url: '/emp/order/orderParent/' + id,
    method: 'delete'
  })
}

// 导出订单
export function exportOrderParent(query) {
  return request({
    url: '/emp/order/orderParent/export',
    method: 'get',
    params: query
  })
}

//项目信息下拉框
export function projectAll(query) {
  return request({
    url: '/emp/project/projectInfo/getAll',
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

// 公司下拉框
export function companyAll(query) {
  return request({
    url: '/emp/ozrs/company/getAll',
    method: 'get',
    params: query
  })
}

// 物料下拉框
export function materielAll(query) {
  return request({
    url: '/emp/base/materiel/tree/select',
    method: 'get',
    params: query
  })
}

// 计量单位下拉框
export function meteringAll(query) {
  return request({
    url: '/emp/base/metering/getAll',
    method: 'get',
    params: query
  })
}

//合同信息
export function contractInfo(query) {
  return request({
    url: '/emp/project/projectInfo/query/info/byId',
    method: 'get',
    params: query
  })
}

//文件上传
export function uploadFile(data) {
  return request({
    url: '/common/shiYue/upload',
    method: 'post',
    data: data
  })
}

// 订单审核
export function getExamine(data) {
  return request({
    url: '/emp/order/orderParent/order/examine',
    method: 'post',
    data: data
  })
}

// 我要采购
export function getPurchase(data) {
  return request({
    url: '/emp/order/orderParent/order/purchase',
    method: 'post',
    data: data
  })
}

// 我要出库
export function getDelivery(data) {
  return request({
    url: '/emp/order/orderParent/order/deliver',
    method: 'post',
    data: data
  })
}

// 查询库存中全部物料
export function getInventoryInfo(query) {
  return request({
    url: '/emp/inOutStorehouse/inventoryInfo/by/inventory',
    method: 'get',
    params: query
  })
}

// 根据物料查询库存数量
export function getInventoryCount(data) {
  return request({
    url: '/emp/inOutStorehouse/inventoryInfo/get/count',
    method: 'post',
    data: data
  })
}

// 仓库下拉框
export function getWarehouse(query) {
  return request({
    url: '/emp/base/warehouse/getAll',
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