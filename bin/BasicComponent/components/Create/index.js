import React, * as react from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Button } from 'antd';

const FormItem = Form.Item;

@connect(({ basicComponents }) => ({
  basicComponents,
}))
@Form.create()
class Create extends react.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 确认按钮回调函数
  okHandle = () => {
    const { form, callbackFunction } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      callbackFunction(fieldsValue);
    });
  };

  render() {
    const {
      modalVisible,
      form: { getFieldDecorator },
      basicComponents: { addButtonLoading },
      handleModalVisible,
    } = this.props;

    return (
      <Modal
        destroyOnClose
        maskClosable={false}
        title="添加基础"
        visible={modalVisible}
        onCancel={() => handleModalVisible()}
        footer={[
          <Button key="back" onClick={() => handleModalVisible()}>
            取消
          </Button>,
          <Button key="submit" type="primary" loading={addButtonLoading} onClick={this.okHandle}>
            确认
          </Button>,
        ]}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="基础名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '基础不能为空',
              },
            ],
          })(
            <Input
              onBlur={this.handleInputValueLength}
              autoComplete="off"
              placeholder="请输入基础名称"
            />
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Create;
