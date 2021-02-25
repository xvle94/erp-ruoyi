import request from '@/utils/request'

// 查询流程定义列表
export function listDefinition(query) {
  return request({
    url: '/emp/process/definition/list',
    method: 'get',
    params: query
  })
}

// 查询流程定义详细
export function getDefinition(id) {
  return request({
    url: '/emp/process/definition/' + id,
    method: 'get'
  })
}

// 新增流程定义
export function addDefinition(data) {
  return request({
    url: '/emp/process/definition',
    method: 'post',
    data: data
  })
}

// 修改流程定义
export function updateDefinition(data) {
  return request({
    url: '/emp/process/definition',
    method: 'put',
    data: data
  })
}

// 删除流程定义
export function delDefinition(id) {
  return request({
    url: '/emp/process/definition/' + id,
    method: 'delete'
  })
}