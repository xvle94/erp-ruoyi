import request from '@/utils/request'

const basePath = '/emp/base/metering';
// 查询计量单位列表
export function listMetering(query) {
  return request({
    url:  basePath + '/list',
    method: 'get',
    params: query
  })
}

// 查询计量单位详细
export function getMetering(id) {
  return request({
    url:  basePath + '/' + id,
    method: 'get'
  })
}

// 新增计量单位
export function addMetering(data) {
  return request({
    url:  basePath,
    method: 'post',
    data: data
  })
}

// 修改计量单位
export function updateMetering(data) {
  return request({
    url:  basePath,
    method: 'put',
    data: data
  })
}

// 删除计量单位
export function delMetering(id) {
  return request({
    url:  basePath + '/' + id,
    method: 'delete'
  })
}
