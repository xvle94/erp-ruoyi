import request from '@/utils/request'

// 查询维修任务列表列表
export function getTasklist(query) {
  return request({
    url: '/repair/tasklist',
    method: 'get',
    params: query
  })
}

// 导出维修任务列表
export function exportRepair(query) {
  return request({
    url: '/repair/tasklistExport',
    method: 'get',
    params: query
  })
}

// 同意指派
export function passAssignment(query) {
    return request({
      url: '/repair/passAssignment',
      method: 'post',
      params: query
    })
  }
  
// 拒绝指派
export function notPassAssignment(query) {
    return request({
        url: '/repair/notPassAssignment',
        method: 'post',
        params: query
    })
}

// 更换配件
export function passRepairChange(query) {
    return request({
      url: '/repair/passRepairChange',
      method: 'post',
      params: query
    })
  }
  
// 不更换配件
export function notPassRepairChange(query) {
    return request({
        url: '/repair/notPassRepairChange',
        method: 'post',
        params: query
    })
}

// 维修完成回显
export function getRepairFinishDetail(query) {
  return request({
      url: '/repair/repairDetail/'+query,
      method: 'post',
      // params: query
  })
}

// 维修完成提交
export function setFinish(data) {
  return request({
      url: '/repair/repairDetail/finish',
      method: 'post',
      data: data
  })
}

// 上传图片
export function uploadFile(data) {
  return request({
      url: '/common/shiYue/upload',
      method: 'post',
      data: data
  })
}