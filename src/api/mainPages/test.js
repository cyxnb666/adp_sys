import request from '@/utils/request'

// /adp/app/execute 查询决策路径by决策id
export function PostTestExecute(data) {
  return request({
    url: '/adp/app/execute',
    method: 'post',
    data
  })
}
