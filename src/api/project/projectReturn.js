import request from '@/utils/request'

// 查询项目回款列表
export function listProjectReturn(query) {
  return request({
    url: '/emp/projectReturn/list',
    method: 'get',
    params: query
  })
}

// 查询项目回款详细
export function getProjectReturn(param) {
  return request({
    url: '/emp/projectReturn/info',
    method: 'get',
    params: param
  })
}


// 修改项目回款
export function updateProjectReturn(data) {
  return request({
    url: '/emp/projectReturn',
    method: 'post',
    data: data
  })
}

// 删除项目回款
export function delProjectReturn(param) {
  return request({
    url: '/emp/projectReturn/del',
    method: 'get',
    params: param
  })
}

// 导出项目回款
export function exportProjectReturn(query) {
  return request({
    url: '/emp/projectReturn/export',
    method: 'get',
    params: query
  })
}
//项目信息下拉框
export function projectAll(query) {
  return request({
    url: '/emp/project/projectInfo/getAll',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getProjectInfo(id) {
  return request({
    url: '/emp/project/projectInfo/' + id,
    method: 'get'
  })
}