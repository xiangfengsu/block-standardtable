import React, { useEffect, useState, useRef } from 'react';
import { Button, Form, Card, Modal, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'dva';
import SearchForms from '@/components/GeneralSearchForm/Index';
import TableList from '@/components/GeneralTableList/Index';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { useQueryFormParams } from '@/utils/hooks';
import { formaterObjectValue, formItemAddInitValue } from '@/utils/utils';
import DetailFormInfo from './ModalDetailForm';

import pageConfig from './pageConfig';

import styles from './index.less';

const StandardTable = ({ form }) => {
  const dispatch = useDispatch();
  const { standardtable, loading } = useSelector(state => state);
  const { modalVisible, confirmLoading } = standardtable;

  const [currentItem, setCurrentItem] = useState({});
  const [modalType, setModalType] = useState('');
  const [formItems, setFormItems] = useState([]);
  const detailFormRef = useRef(null);
  const modelReduceType = useRef('fetch');
  const [payload, { setQuery, setPage, setFormAdd, setFormUpdate }] = useQueryFormParams();

  const { searchForms, tableColumns, detailFormItems } = pageConfig();

  useEffect(() => {
    dispatch({
      type: `standardtable/${modelReduceType.current}`,
      payload,
    });
  }, [payload]);

  const updateFormItems = (record = {}) => {
    const newFormItems = formItemAddInitValue([...detailFormItems], record);
    setFormItems([...newFormItems]);
  };

  const changeModalVisibel = flag => {
    dispatch({
      type: 'standardtable/modalVisible',
      payload: {
        modalVisible: flag,
      },
    });
  };

  const showModalVisibel = (type, record) => {
    updateFormItems(record);
    changeModalVisibel(true);
    setModalType(type);
    setCurrentItem(record);
  };

  const hideModalVisibel = () => {
    changeModalVisibel(false);
    setCurrentItem({});
  };

  const deleteTableRowHandle = id => {
    modelReduceType.current = 'delete';
    setFormUpdate({ id });
  };

  const renderSearchForm = () => {
    const props = {
      form,
      formInfo: {
        layout: 'inline',
        formItems: searchForms,
      },
      handleSearchSubmit: queryValues => {
        modelReduceType.current = 'fetch';
        const query = formaterObjectValue(queryValues);
        setQuery(query);
      },
      handleFormReset: () => {
        modelReduceType.current = 'fetch';
        setQuery({});
      },
    };
    return <SearchForms {...props} />;
  };

  const extraTableColumnRender = () => {
    const columns = [
      {
        title: '操作',
        render: (_, record) => {
          return (
            <div>
              <a
                onClick={() => {
                  showModalVisibel('update', record);
                }}
              >
                编辑
              </a>
              &nbsp;
              <Popconfirm
                title="确定删除吗？"
                onConfirm={() => {
                  deleteTableRowHandle(record.id);
                }}
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  const renderTable = () => {
    const tableLoading = loading.models.standardtable;
    const {
      data: { list, pagination },
    } = standardtable;
    const newTableColumns = [...tableColumns, ...extraTableColumnRender()];
    const tableProps = {
      loading: tableLoading,
      dataSource: list,
      columns: newTableColumns,
      pagination: { pageSize: 10,...pagination  },
      handleTableChange: ({ current ,pageSize}) => {
        modelReduceType.current = 'fetch';
        setPage({ current,pageSize });
      },
      bordered: false,
    };
    return <TableList {...tableProps} />;
  };

  const modalOkHandle = () => {
    if (detailFormRef.current) {
      detailFormRef.current.validateFieldsAndScroll((err, fieldsValue) => {
        if (err) return;

        const fields = formaterObjectValue(fieldsValue);
        if (modalType === 'create') {
          modelReduceType.current = 'create';
          setFormAdd(fields);
        } else if (modalType === 'update') {
          modelReduceType.current = 'update';
          setFormUpdate(fields);
        }
      });
    }
  };

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            {renderSearchForm()}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => showModalVisibel('create', {})}>
                新建
              </Button>
            </div>
            {renderTable()}
          </div>
        </div>
      </Card>
      <Modal
        destroyOnClose
        visible={modalVisible}
        confirmLoading={confirmLoading}
        onCancel={hideModalVisibel}
        onOk={modalOkHandle}
      >
        <DetailFormInfo ref={detailFormRef} formItems={formItems} />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default Form.create()(StandardTable);
