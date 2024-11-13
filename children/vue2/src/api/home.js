import $http from '@/utils/http';
const uri = '/tableApi';

export async function tableListApi() {
  return $http.get(`${uri}/table/list`);
}

export async function tableSaveApi(params) {
  return $http.post(`${uri}/table/save`, params);
}

export async function tableDelApi(params) {
  return $http.post(`${uri}/table/del`, params);
}
