import request from '@/utils/request'

// 查询流程实例列表
export function listExample(query) {
  return request({
    url: '/emp/process/example/list',
    method: 'get',
    params: query
  })
}

// 查询流程实例详细
export function getExample(id) {
  return request({
    url: '/emp/process/example/' + id,
    method: 'get'
  })
}

// 新增流程实例
export function addExample(data) {
  return request({
    url: '/emp/process/example',
    method: 'post',
    data: data
  })
}

// 修改流程实例
export function updateExample(data) {
  return request({
    url: '/emp/process/example',
    method: 'put',
    data: data
  })
}

// 删除流程实例
export function delExample(id) {
  return request({
    url: '/emp/process/example/' + id,
    method: 'delete'
  })
}
// 获取全部流程定义
export function getAllDefinition(){
  return request({
    url: '/emp/process/example/getAllDefinition',
    method: 'get'
  })
}