import request from '@/utils/request'

// 查询基本信息列表
export function listSupplier(query) {
  return request({
    url: '/emp/ozrs/supplier/list',
    method: 'get',
    params: query
  })
}

// 查询基本信息详细
export function getSupplier(id) {
  return request({
    url: '/emp/ozrs/supplier/' + id,
    method: 'get'
  })
}

// 新增基本信息
export function addSupplier(data) {
  return request({
    url: '/emp/ozrs/supplier',
    method: 'post',
    data: data
  })
}

// 修改基本信息
export function updateSupplier(data) {
  return request({
    url: '/emp/ozrs/supplier',
    method: 'put',
    data: data
  })
}

// 删除基本信息
export function delSupplier(id) {
  return request({
    url: '/emp/ozrs/supplier/' + id,
    method: 'delete'
  })
}

// 导出基本信息
export function exportSupplier(query) {
  return request({
    url: '/emp/ozrs/supplier/export',
    method: 'get',
    params: query
  })
}