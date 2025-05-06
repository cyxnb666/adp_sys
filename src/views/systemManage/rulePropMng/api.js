import http from '@/utils/http'

export function getGroupList() {
  return http({
    url: '/rule/attribute/getGroupList',
    method: 'get'
  })
}

export function saveGroup(data) {
  return http({
    url: '/rule/attribute/saveGroup',
    method: 'post',
    data
  })
}

export function getAttributeTags(data) {
  return http({
    url: '/rule/attribute/getAttributeTags',
    method: 'post',
    data
  })
}

export function saveAttributeTag(data) {
  return http({
    url: '/rule/attribute/saveAttributeTag',
    method: 'post',
    data
  })
}

export function deleteGroup(id) {
  return http({
    url: `/rule/attribute/deleteGroup/${id}`,
    method: 'post',
  })
}
export function invalid(id) {
  return http({
    url: `/rule/attribute/invalid/${id}`,
    method: 'post',
  })
}

export function deleteAttributeTag(id) {
  return http({
    url: `/rule/attribute/deleteAttributeTag/${id}`,
    method: 'post',
  })
}

