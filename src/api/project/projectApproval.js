import request from '@/utils/request'

// 查询项目审批列表
export function listProject(query) {
  return request({
    url: '/emp/approval/project/list',
    method: 'get',
    params: query
  })
}

// 审批项目
export function projectApproval(data) {
    return request({
      url: '/emp/approval/project/approval',
      method: 'post',
      data: data
    })
}

// 查询审批项目信息详细
export function getProjectInfo(id) {
  return request({
    url: '/emp/project/projectInfo/' + id,
    method: 'get'
  })
}
// 根据流程实例id查询最新流程历史
export function getProcessHistory(query) {
  return request({
    url: '/emp/approval/process/history',
    method: 'get',
    params: query
  })
}