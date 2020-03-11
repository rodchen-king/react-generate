import { message } from 'antd';
import { transformListPagination, handleError } from '@/utils/utils';
import { fetchItemList, addItem, updateItem, deleteItem, getItemOne } from '../service';

export default {
  namespace: 'basicComponents',

  state: {
    // 列表数据
    data: {
      list: [],
      pagination: {},
    },

    // 编辑行数据 / 选择行数据
    selectItem: {},

    // 引用数据

    // 按钮状态标识
    addButtonLoading: false,
    updateButtonLoading: false,
    getSelectOneLoading: false,
  },

  effects: {
    // 查询基础数据
    *fetchModelList({ payload }, { call, put }) {
      const response = yield call(fetchItemList, payload);
      if (handleError(response)) {
        yield put({
          type: 'save',
          payload: {
            data: transformListPagination(response.data),
          },
        });
      }
    },

    // 新增基础数据
    *addModel({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          addButtonLoading: true,
        },
      });
      const response = yield call(addItem, payload);
      yield put({
        type: 'save',
        payload: {
          addButtonLoading: false,
        },
      });
      if (handleError(response)) {
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },

    // 查询基础数据详情
    *getOneModel({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          getSelectOneLoading: true,
        },
      });
      const response = yield call(getItemOne, payload);
      yield put({
        type: 'save',
        payload: {
          getSelectOneLoading: false,
        },
      });
      if (handleError(response)) {
        yield put({
          type: 'save',
          payload: {
            selectItem: response.data,
          },
        });
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },

    // 更新基础数据
    *updateModel({ payload, callback }, { call, put }) {
      yield put({
        type: 'save',
        payload: {
          updateButtonLoading: true,
        },
      });
      const response = yield call(updateItem, payload);
      yield put({
        type: 'save',
        payload: {
          updateButtonLoading: false,
        },
      });
      if (handleError(response)) {
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },

    // 删除基础数据
    *deleteModel({ payload, callback }, { call }) {
      const response = yield call(deleteItem, payload);
      if (handleError(response)) {
        if (callback) callback();
      } else {
        message.error(response.msg);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
