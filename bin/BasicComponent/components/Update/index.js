import React, * as react from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Button, Spin } from 'antd';

const FormItem = Form.Item;

@connect(({ basicComponents }) => ({
  basicComponents,
}))
@Form.create()
class Update extends react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { values, dispatch } = this.props;

    dispatch({
      type: 'basicComponents/getOneModel',
      payload: values.id,
    });
  }

  // 确认按钮回调函数
  okHandle = () => {
    const { form, callbackFunction, values } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const valu = { ...fieldsValue };
      const val = {
        valu,
        areaId: values.id,
        storeId: localStorage.getItem('storeId'),
      };
      callbackFunction(val);
    });
  };

  render() {
    const {
      modalVisible,
      form: { getFieldDecorator },
      basicComponents: { updateButtonLoading, selectItem, getSelectOneLoading },
      handleModalVisible,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title="编辑基础"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={updateButtonLoading} onClick={this.okHandle}>
            确认
          </Button>,
        ]}
      >
        <Spin spinning={getSelectOneLoading}>
          <Form style={{ textAlign: 'left' }}>
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基础名称">
              {getFieldDecorator('name', {
                initialValue: selectItem.name,
                rules: [
                  {
                    required: true,
                    message: '基础不能为空',
                  },
                ],
              })(
                <Input
                  // onBlur={this.handleInputValueLength}
                  autoComplete="off"
                  placeholder="请输入基础名称"
                />
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>
    );
  }
}

export default Update;
