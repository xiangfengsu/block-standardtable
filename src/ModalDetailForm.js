import React from 'react';
import { Form, Row, Col, Card } from 'antd';

import renderFormItem from '@/core/common/renderFormItem';

const DetailFormInfo = props => {
  const renderFormItemHandle = () => {
    const { formItems, form } = props;
    const formItemList = formItems.map(item => {
      const InputType = renderFormItem(item, form);
      return (
        <Col
          lg={item.colSpan === 0 ? 0 : item.colSpan || 8}
          md={item.colSpan === 0 ? 0 : 12}
          sm={item.colSpan === 0 ? 0 : 24}
          key={item.key}
        >
          {InputType}
        </Col>
      );
    });
    return formItemList;
  };

  return (
    <Card bordered={false} loading={false}>
      <Form>
        <Row gutter={24}>{renderFormItemHandle()}</Row>
      </Form>
    </Card>
  );
};

export default React.memo(Form.create()(DetailFormInfo));
