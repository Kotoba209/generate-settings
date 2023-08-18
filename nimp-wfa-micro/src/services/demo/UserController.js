/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
// import { useRequest, request } from 'umi';
import request from '@/utils/request';

// export const queryList = () => {

//   const res = request("/api/list").then(resp => {
//     console.log('resp', resp)
//   });
//   console.log(res);
// };

/** 此处后端没有提供注释 GET /api/v1/queryList */
export async function queryList(params) {
  console.log('request', request);
  return request.post('nimp-fnp-ms/api/tsRegionOrder/queryRegionOroder', {
    ...params,
  });
}

export async function getRegion(params) {
  return request.get('nimp-fnp-ms/api/staticDataCache/getRegion', {
    ...params,
  });
}

export async function getAllCname(params) {
  return request.get('nimp-fnp-ms/api/fltStaticData/getAllCname', {
    ...params,
  });
}

/** 此处后端没有提供注释 POST /api/v1/user */
export async function addRegionOrder(params) {
  return request.post('nimp-fnp-ms/api/tsRegionOrder/addRegionOrder', {
    ...params,
  });
}

/** 此处后端没有提供注释 PUT /api/v1/user/${param0} */
export async function modifyRegionOrder(params) {
  // const { userId: param0 } = params;
  return request.post('nimp-fnp-ms/api/tsRegionOrder/updateRegionOrder', {
    ...params,
  });
}

/** 此处后端没有提供注释 DELETE /api/v1/user/${param0} */
export async function deleteRegionOrder(ids) {
  console.log('ids', ids)
  return request.post(
    `/nimp-fnp-ms/api/tsRegionOrder/deleteRegionOrder?deleteIds=${ids}`,
  );
}
