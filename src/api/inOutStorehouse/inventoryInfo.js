import request from '@/utils/request'

// 查询实时库存列表
export function listInventoryInfo(query) {
  return request({
    url: '/emp/inOutStorehouse/inventoryInfo/list',
    method: 'get',
    params: query
  })
}


// 导出实时库存
export function exportInventoryInfo(query) {
  return request({
    url: '/emp/inOutStorehouse/inventoryInfo/export',
    method: 'get',
    params: query
  })
}