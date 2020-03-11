import { stringify } from 'qs';
import request from '@/utils/request';
import baseUrl from '@/services/baseUrl';

// 查询基础数据列表
export async function fetchItemList(params) {
  return request(`${baseUrl}/street/page?${stringify(params)}`);
}

// 查询基础数据详情
export async function getItemOne(id) {
  return request(`${baseUrl}/street/${id}`);
}

// 新增基础数据
export async function addItem(params) {
  return request(`${baseUrl}/street`, {
    method: 'POST',
    body: params,
  });
}

// 编辑基础数据
export async function updateItem(params) {
  return request(`${baseUrl}/street/${params.areaId}`, {
    method: 'PATCH',
    body: params.valu,
  });
}

// 删除基础数据
export async function deleteItem(ids) {
  return request(`${baseUrl}/street/lockStreet/${ids}`, {
    method: 'DELETE',
    body: {},
  });
}

// 启用基础数据
export async function ableItem(ids) {
  return request(`${baseUrl}/street/unlockStreet/${ids}`, {
    method: 'PATCH',
    body: {},
  });
}

// 停用基础数据
export async function disableItem(ids) {
  return request(`${baseUrl}/street/lockStreet/${ids}`, {
    method: 'PATCH',
    body: {},
  });
}
