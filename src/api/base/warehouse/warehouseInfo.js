import request from '@/utils/request'

const basePath = '/emp/base/warehouse';
// 查询仓库信息列表
export function listWarehouseInfo(query) {
  return request({
    url: basePath + '/list',
    method: 'get',
    params: query
  })
}

// 查询仓库信息详细
export function getWarehouseInfo(id) {
  return request({
    url:  basePath + '/'+ + id,
    method: 'get'
  })
}

// 新增仓库信息
export function addWarehouseInfo(data) {
  return request({
    url:  basePath ,
    method: 'post',
    data: data
  })
}

// 修改仓库信息
export function updateWarehouseInfo(data) {
  return request({
    url: basePath,
    method: 'put',
    data: data
  })
}

// 删除仓库信息
export function delWarehouseInfo(id) {
  return request({
    url: basePath +'/' + id,
    method: 'delete'
  })
}
