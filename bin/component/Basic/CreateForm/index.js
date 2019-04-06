import React, * as react from 'react';
import PropTypes from 'prop-types';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Select, Modal } from 'antd';

// service
// Todo

// enum
import ENUMERATIONDATA from '@/common/EnumerationData';
// invoke enum

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class CreateForm extends react.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      roleList: [],
    };
  }

  componentDidMount() {
    // to get init data
  }

  // dialog确认按钮回调函数
  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // to do (相关数据处理)
      handleAdd(fieldsValue);
    });
  };

  render() {
    const { form, createModalVisible, handleModalVisible } = this.props;
    const { roleList } = this.state;


    return (
      <Modal
        destroyOnClose
        title={formatMessage({ id: 'system.basic.createPage.title' })}
        visible={createModalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        {/* input eample */}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={formatMessage({ id: 'system.basic.createPage.basicExample' })}
        >
          {form.getFieldDecorator('basic', {
            rules: [
              { required: true, message: formatMessage({ id: 'system.basic.createPage.basicExampleLength' }) },
              {
                max: 50,
                message: formatMessage({ id: 'system.basic.createPage.basicExampleValidLength' }),
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Input
              placeholder={formatMessage({
                id: 'system.basic.createPage.basicExampleInputPlaceholder',
              })}
            />
          )}
        </FormItem>

        {/* select example */}
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label={formatMessage({ id: 'system.basic.createPage.basicExample' })}
        >
          {form.getFieldDecorator('roleIdList', {
            rules: [
              {
                required: true,
                message: formatMessage({ id: 'system.basic.createPage.basicExampleRequire' }),
              },
            ],
            validateTrigger: 'onBlur',
          })(
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder={formatMessage({ id: 'system.basic.createPage.basicExamplePlaceholder' })}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {roleList.map(role => (
                <Option key={role.id} value={role.id}>
                  {role.roleName}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      </Modal>
    );
  }
}

CreateForm.propTypes = {
  handleAdd: PropTypes.func,
};

export default CreateForm;
