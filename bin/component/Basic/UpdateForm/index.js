import React, { PureComponent } from 'react';
import { Form, Input, Select, Modal, message, Spin } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';

// service
// todo

// enum
import ENUMERATIONDATA from '@/common/EnumerationData';
// todo

const FormItem = Form.Item;
const { Option } = Select;

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      roleList: [],
      BasicInfo: {},
    };
  }

  componentDidMount() {
    // todo 初始化数据
  }

  okHandle = () => {
    const { handleUpdate, form, values } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;

      // 相关数据处理
      handleUpdate(fieldsValue);
    });
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, form } = this.props;
    const { BasicInfo, roleList } = this.state;

    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={formatMessage({ id: 'system.basic.updatePage.title' })}
        onOk={this.okHandle}
        visible={updateModalVisible}
        onCancel={() => handleUpdateModalVisible()}
      >
        <Spin spinning={!BasicInfo.username}>
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
        </Spin>
      </Modal>
    );
  }
}

export default UpdateForm;
