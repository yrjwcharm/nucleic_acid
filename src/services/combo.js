import request from "../utils/request";
import Api from "../config/api";

/**
 * 获取医院选择列表
 * @param payload
 * @returns {Promise<void>}
 */
export  async  function queryComboListByOrgApi(payload){
  return request.get(Api.queryComboListByOrgApi,payload);
}
export  async  function  fetchSourceApi(payload){
  return request.get(Api.fetchSourceApi,payload)
}

export  async  function fetchAppointDetectApi(payload){
  return request.get(Api.appointDetect,payload)
}
