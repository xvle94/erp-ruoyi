import request from '@/utils/request'

// 查询开票申请列表
export function listInvoiceApply(query) {
  return request({
    url: '/emp/invoice/apply/list',
    method: 'get',
    params: query
  })
}

// 查询开票申请详细
export function getInvoiceApply(query) {
  return request({
    url: '/emp/invoice/apply/info',
    method: 'get',
    params: query
  })
}

// 新增开票申请
export function addInvoiceApply(data) {
  return request({
    url: '/emp/invoice/apply',
    method: 'post',
    data: data
  })
}

// 修改开票申请
export function updateInvoiceApply(data) {
  return request({
    url: '/emp/invoice/apply',
    method: 'put',
    data: data
  })
}

// 删除开票申请
export function delInvoiceApply(projectId) {
  return request({
    url: '/emp/invoice/apply/' + projectId,
    method: 'delete'
  })
}

// 导出开票申请
export function exportInvoiceApply(query) {
  return request({
    url: '/emp/invoice/apply/export',
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

// 查询所有客户信息
export function customerAll() {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get'
  })
}

// 开票审核
export function updateExamine(data) {
  return request({
    url: '/emp/invoice/apply/examine',
    method: 'post',
    data: data
  })
}

// 查询订单总金额、已回款、待回款金额
export function queryProjectMoney() {
  return request({
    url:'/emp/project/projectInfo/query/project/money',
    method: 'get'
  })
}
