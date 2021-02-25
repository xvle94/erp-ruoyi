import request from '@/utils/request'

// 查询列表
export function visitList(query) {
  return request({
    url: '/project/visit/list',
    method: 'get',
    params: query
  })
}

// 修改
export function update(data) {
  return request({
    url: '/project/visit',
    method: 'post',
    data: data
  })
}

// 修改回显
export function getDetail(id) {
  return request({
    url: '/project/visit/' + id,
    method: 'get',
  })
}

// 删除
export function del(id) {
  return request({
    url: '/project/visit/' + id,
    method: 'delete'
  })
}

// 详情
export function detailFn(id) {
  return request({
    url: '/project/visit/' + id,
    method: 'get'
  })
}

// 导出订单回访
export function exportVisit(query) {
  return request({
    url: '/project/visit/export',
    method: 'get',
    params: query
  })
}