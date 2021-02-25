import request from '@/utils/request'

// 查询客户基本信息列表
export function listCustomer(query) {
  return request({
    url: '/emp/ozrs/customer/list',
    method: 'get',
    params: query
  })
}

// 查询客户基本信息详细
export function getCustomer(id) {
  return request({
    url: '/emp/ozrs/customer/' + id,
    method: 'get'
  })
}

// 新增客户基本信息
export function addCustomer(data) {
  return request({
    url: '/emp/ozrs/customer',
    method: 'post',
    data: data
  })
}

// 修改客户基本信息
export function updateCustomer(data) {
  return request({
    url: '/emp/ozrs/customer',
    method: 'put',
    data: data
  })
}

// 删除客户基本信息
export function delCustomer(id) {
  return request({
    url: '/emp/ozrs/customer/' + id,
    method: 'delete'
  })
}

// 导出客户基本信息
export function exportCustomer(query) {
  return request({
    url: '/emp/ozrs/customer/export',
    method: 'get',
    params: query
  })
}