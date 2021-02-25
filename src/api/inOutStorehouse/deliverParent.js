import request from '@/utils/request'

// 查询送货单列表
export function listDeliverParent(query) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent/list',
    method: 'get',
    params: query
  })
}

// 查询送货单详细
export function getDeliverParent(id) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent/' + id,
    method: 'get'
  })
}

// 新增送货单
export function addDeliverParent(data) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent',
    method: 'post',
    data: data
  })
}

// 修改送货单
export function updateDeliverParent(data) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent',
    method: 'put',
    data: data
  })
}

// 删除送货单
export function delDeliverParent(id) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent/' + id,
    method: 'delete'
  })
}

// 导出送货单
export function exportDeliverParent(query) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent/export',
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

// 导出送货单doc
export function exportInfo(data) {
  return request({
    url: '/emp/inOutStorehouse/deliverParent/export/word',
    method: 'get',
    params: data
  })
}

// 仓库下拉框
export function getWarehouse(query) {
  return request({
    url: '/emp/base/warehouse/getAll',
    method: 'get',
    params: query
  })
}

// 文件上传
export function uploadFile(data) {
  return request({
    url: '/common/shiYue/upload',
    method: 'post',
    data: data
  })
}
