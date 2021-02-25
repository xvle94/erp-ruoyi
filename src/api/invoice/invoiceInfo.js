import request from '@/utils/request'

// 查询发票溯源列表
export function listInvoiceInfo(query) {
  return request({
    url: '/emp/invoice/info/list',
    method: 'get',
    params: query
  })
}

// 查询发票溯源详细
export function getInvoiceInfo(id) {
  return request({
    url: '/emp/invoice/info/' + id,
    method: 'get'
  })
}
// 修改发票溯源
export function updateInvoiceInfo(data) {
  return request({
    url: '/emp/invoice/info',
    method: 'put',
    data: data
  })
}

// 查询所有客户信息
export function customerAll() {
  return request({
    url: '/emp/ozrs/customer/getAll',
    method: 'get'
  })
}

// 导出发票签收单doc
export function exportInfo(data) {
  return request({
    url: '/emp/invoice/info/export/word',
    method: 'get',
    params: data
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
