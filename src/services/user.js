import request from '../utils/request';
import Api from '../config/api';

/**
 *  获取搜索关键字
 */
export async function getUserIndex() {
  return request.get(Api.UserIndex);
}

/**
 * 获取我的预约
 * @param payload
 * @returns {Promise<*>}
 */
export async function getMyAppointListApi(payload){
  return request.get(Api.MyAppointApi,payload);

}

/**
 * 获取审核记录
 * @param payload
 * @returns {Promise<*>}
 */
export async  function  getAuditRecordApi(payload){
  return request.get(Api.MyAuditRecord,payload);

}

