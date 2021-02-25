import request from '@/utils/request'

// 查询入库申请列表
export function listJoinWarehouse(query) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse/list',
    method: 'get',
    params: query
  })
}

// 查询入库申请详细
export function getJoinWarehouse(query) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse/by/warehouseNo',
    method: 'get',
    params: query
  })
}

// 新增入库申请
export function addJoinWarehouse(data) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse',
    method: 'post',
    data: data
  })
}

// 修改入库申请
export function updateJoinWarehouse(data) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse',
    method: 'put',
    data: data
  })
}



// 导出入库申请
export function exportJoinWarehouse(query) {
  return request({
    url: '/emp/inOutStorehouse/joinWarehouse/export',
    method: 'get',
    params: query
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