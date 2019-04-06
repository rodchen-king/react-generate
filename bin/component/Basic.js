import { stringify } from 'qs';
import request from '@/utils/request';
import baseUrl from '@/services/baseUrl';

// 查询列表
export async function queryAccount(params) {
  return request(`${baseUrl}/sys/user?${stringify(params)}`);
}

// 删除（单个/批量）
export async function removeAccount(params) {
  return request(`${baseUrl}/sys/user/${params}`, {
    method: 'DELETE',
  });
}

// 添加
export async function addAccount(params) {
  return request(`${baseUrl}/sys/user`, {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

// 获取信息
export async function queryAccountInfo(userId) {
  return request(`${baseUrl}/sys/user/info/${userId}`);
}

// 更新信息
export async function updateAccount(params) {
  return request(`${baseUrl}/sys/user/${params.id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  });
}