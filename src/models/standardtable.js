import { message } from 'antd';
import modelExtend from 'dva-model-extend';
import { queryPost } from '@/core/service/generalApi';
import { tablePageModel } from '@/core/common/baseModel';

export default modelExtend(tablePageModel, {
  namespace: 'standardtable',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    modalVisible: false,
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryPost, payload, '/sys/tablelist/list');
      if (response) {
        const { code, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              data: body,
            },
          });
        }
      }
    },
    *create({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(queryPost, payload, '/sys/tablelist/save');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code = 200, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              data: body,
            },
          });
          message.success('创建成功');
        }
      }
    },
    *update({ payload }, { call, put }) {
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: true,
        },
      });
      const response = yield call(queryPost, payload, '/sys/tablelist/update');
      yield put({
        type: 'changgeConfirmLoading',
        payload: {
          confirmLoading: false,
        },
      });
      if (response) {
        const { code = 200, body } = response;
        if (code === 200) {
          yield put({
            type: 'modalVisible',
            payload: {
              modalVisible: false,
            },
          });
          yield put({
            type: 'save',
            payload: {
              data: body,
            },
          });
          message.success('修改成功');
        }
      }
    },
    *delete({ payload }, { call, put }) {
      const response = yield call(queryPost, payload, '/sys/tablelist/del');

      if (response) {
        const { code = 200, body } = response;
        if (code === 200) {
          yield put({
            type: 'save',
            payload: {
              data: body,
            },
          });
          message.success('删除成功');
        }
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    modalVisible(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    changgeConfirmLoading(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
});
