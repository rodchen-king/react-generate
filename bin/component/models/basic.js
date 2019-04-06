import {
  queryBasic,
  removeBasic,
  addBasic,
  updateBasic,
} from '@/services/capabilityDomain/basic';

import { message } from 'antd';

export default {
  namespace: 'basic',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(queryBasic, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      } catch (err) {
        message.error(err.msg);
      }
    },
    *add({ payload, successCallback, failCallBack }, { call }) {
      try {
        yield call(addBasic, payload);
        if (successCallback) successCallback();
      } catch (err) {
        if (failCallBack) failCallBack(err);
      }
    },
    *remove({ payload, successCallback, failCallBack }, { call }) {
      try {
        JSON.parse(yield call(removeBasic, payload));
        if (successCallback) successCallback();
      } catch (err) {
        if (failCallBack) failCallBack(err);
      }
    },
    *update({ payload, successCallback, failCallBack }, { call }) {
      try {
        yield call(updateBasic, payload);
        if (successCallback) successCallback();
      } catch (err) {
        if (failCallBack) failCallBack(err);
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
};
