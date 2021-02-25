import request from '@/utils/request'

// 查询流程历史列表
export function listHistory(query) {
  return request({
    url: '/process/history/list',
    method: 'get',
    params: query
  })
}

// 查询流程历史详细
export function getHistory(id) {
  return request({
    url: '/process/history/' + id,
    method: 'get'
  })
}

// 新增流程历史
export function addHistory(data) {
  return request({
    url: '/process/history',
    method: 'post',
    data: data
  })
}

// 修改流程历史
export function updateHistory(data) {
  return request({
    url: '/process/history',
    method: 'put',
    data: data
  })
}

// 删除流程历史
export function delHistory(id) {
  return request({
    url: '/process/history/' + id,
    method: 'delete'
  })
}

// 导出流程历史
export function exportHistory(query) {
  return request({
    url: '/process/history/export',
    method: 'get',
    params: query
  })
}