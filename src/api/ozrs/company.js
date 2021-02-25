import request from '@/utils/request'

// 查询基本信息列表
export function listCompany(query) {
  return request({
    url: '/emp/ozrs/company/list',
    method: 'get',
    params: query
  })
}

// 查询基本信息详细
export function getCompany(id) {
  return request({
    url: '/emp/ozrs/company/' + id,
    method: 'get'
  })
}

// 新增基本信息
export function addCompany(data) {
  return request({
    url: '/emp/ozrs/company',
    method: 'post',
    data: data
  })
}

// 修改基本信息
export function updateCompany(data) {
  return request({
    url: '/emp/ozrs/company',
    method: 'put',
    data: data
  })
}

// 删除基本信息
export function delCompany(id) {
  return request({
    url: '/emp/ozrs/company/' + id,
    method: 'delete'
  })
}

// 导出基本信息
export function exportCompany(query) {
  return request({
    url: '/ozrs/company/export',
    method: 'get',
    params: query
  })
}