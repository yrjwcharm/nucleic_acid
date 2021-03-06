import request from '../utils/request';
import Api from '../config/api';
/**
 * 获取医院选择列表
 * @param payload
 * @returns {Promise<void>}
 */
export  async  function getQueryOrgListByNameApi(payload){
  return request.get(Api.queryOrgListByNameApi,payload);
}
